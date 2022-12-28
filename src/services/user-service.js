const bcrypt = require('bcrypt');
const Uuid = require('uuid');

const { AVATAR_STATIC_PATH } = require('../../settings');
const { API_URL } = require('../constants/constants');
const BadRequestError = require('../errors/bad-request-error');
const { ERROR_TYPE } = require('../constants/errors');
const ForbiddenError = require('../errors/forbidden-error');
const { HTTP_RESPONSE } = require('../constants/errors');
const MailService = require('../services/mail-service');
const NotFoundError = require('../errors/not-found-error');
const Role = require('../models/role');
const { saveFileAndGetURN } = require('../utils');
const TokenService = require('../services/token-service');
const UnauthorizedError = require('../errors/unauthorized-error');
const User = require('../models/user');
const UserDto = require('../dtos/user-dto');
const UserDataDto = require('../dtos/user-data-dto');

const createUser = async ({ name, avatar, about, email, password }) => {
  try {
    const candidate = await User.findOne({ email });
    if (candidate) {
      throw new BadRequestError();
    }

    const items = await Role.find({});
    const [userRole] = items;
    const roles = [userRole.value];

    const hash = await bcrypt.hash(password, 10);
    const activationLink = Uuid.v4();
    const user = await User.create({
      name,
      avatar,
      about,
      email,
      password: hash,
      roles,
      activationLink
    });

    const activationUri = `${API_URL}/activate/${activationLink}`;

    await MailService.sendActivationMail(email, activationUri);
    const userDataDto = new UserDataDto(user);
    return userDataDto;
  } catch (error) {
    if (error.name === ERROR_TYPE.validity || error.name === ERROR_TYPE.cast) {
      throw new BadRequestError();
    }
    throw error;
  }
};

const login = async (email, password) => {
  try {
    const user = await User.findUserByCredentials(email, password);

    if (!user.isActivated) {
      throw new ForbiddenError(
        HTTP_RESPONSE.forbidden.absentMessage.noActivation
      );
    }

    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({
      ...userDto,
    });
    await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    const userDataDto = new UserDataDto(user);

    return { ...tokens, ...userDataDto };
  } catch (error) {
    throw error;
  }
};

const activateAccount = async (activationLink) => {
  try {
    const user = await User.findOne({ activationLink });
    if (!user) {
      throw new NotFoundError();
    }

    if (user.isActivated) {
      throw new BadRequestError();
    }

    user.activationLink = '';
    user.isActivated = true;

    await user.save();
    const userDto = new UserDto(user);
    return userDto;
  } catch (error) {
    throw error;
  }
};

const logout = async (refreshToken) => {
  try {
    await TokenService.removeRefreshToken(refreshToken);
    return true;
  } catch (error) {
    throw error;
  }
};

const refreshToken = async (token) => {
  if (!token) {
    throw new UnauthorizedError();
  }
  try {
    const userData = TokenService.validateRefreshToken(token);
    const tokenFromDb = await TokenService.findToken(token);
    if (!userData || !tokenFromDb) {
      throw new UnauthorizedError();
    }
    const user = await User.findById(userData.id);
    const userDto = new UserDto(user);
    const tokens = TokenService.generateTokens({
      ...userDto,
      origin: tokenFromDb._id,
    });
    await TokenService.saveRefreshToken(userDto.id, tokens.refreshToken);

    const userDataDto = new UserDataDto(user);
    return { ...tokens, ...userDataDto };
  } catch (error) {
    throw error;
  }
};

const getUserById = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
    }

    const userDto = new UserDataDto(user);
    return userDto;
  } catch (error) {
    if (error.name === ERROR_TYPE.cast) {
      throw new BadRequestError();
    }
    throw error;
  }
};

const updateUser = async (id, name, about) => {
  try {
    const user = await User.findByIdAndUpdate(id, { name, about }, { new: true });
    if (!user) {
      throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
    }
    const userDto = new UserDataDto(user);
    return userDto;
  } catch (error) {
    if (error.name === ERROR_TYPE.validity || error.name === ERROR_TYPE.cast) {
      throw new BadRequestError();
    }
    throw error;
  }
};

const updateAvatar = async (file, userId) => {
  try {
    const avatarURN = saveFileAndGetURN(file, AVATAR_STATIC_PATH);
    const user = await User.findByIdAndUpdate(
      userId,
      { avatar: avatarURN },
      { new: true }
    );

    if (!user) {
      throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
    }

    const userDto = new UserDataDto(user);
    return userDto;
  } catch (error) {
    if (error.name === ERROR_TYPE.validity || error.name === ERROR_TYPE.cast) {
      throw new BadRequestError();
    }
    throw error;
  }
};

const getCurrentUser = async (id) => {
  try {
    const user = await User.findById(id);
    if (!user) {
      throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
    }
    const userDto = new UserDataDto(user);
    return userDto;
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createUser,
  login,
  activateAccount,
  logout,
  refreshToken,
  getUserById,
  updateUser,
  updateAvatar,
  getCurrentUser,
};
