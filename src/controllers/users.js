const { CLIENT_URL } = require('../constants/constants');
const UserService = require('../services/user-service');

const REFRESH_TOKEN_DAYS = 30;

function daysToMilliseconds(days) {
  // hour  min  sec  ms
  return days * 24 * 60 * 60 * 1000;
}

const REFRESH_TOKEN_AGE = daysToMilliseconds(REFRESH_TOKEN_DAYS);

module.exports.createUser = async (req, res, next) => {
  try {
    const userData = await UserService.createUser(req.body);
    res.send({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      about: userData.about,
      email: userData.email,
      isActivated: userData.isActivated,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const userData = await UserService.login(email, password);

    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: REFRESH_TOKEN_AGE,
      httpOnly: true,
    });

    res.send({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      about: userData.about,
      email: userData.email,
      isActivated: userData.isActivated,
      accessToken: userData.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.activateAccount = async (req, res, next) => {
  try {
    const activationLink = req.params.link;
    await UserService.activateAccount(activationLink);
    res.redirect(200, CLIENT_URL);
  } catch (error) {
    next(error);
  }
};

module.exports.logout = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    await UserService.logout(refreshToken);
    res.clearCookie('refreshToken');
    res.send({ message: 'Token was removed' });
  } catch (error) {
    next(error);
  }
};

module.exports.refreshAccessToken = async (req, res, next) => {
  try {
    const { refreshToken } = req.cookies;
    const userData = await UserService.refreshToken(refreshToken);
    res.cookie('refreshToken', userData.refreshToken, {
      maxAge: REFRESH_TOKEN_AGE,
      httpOnly: true,
    });
    res.send({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      about: userData.about,
      email: userData.email,
      isActivated: userData.isActivated,
      accessToken: userData.accessToken,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getUserById = async (req, res, next) => {
  try {
    const userData = await UserService.getUserById(req.params.id);
    res.send({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      about: userData.about,
      email: userData.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateUser = async (req, res, next) => {
  const { name, about } = req.body;
  try {
    const userData = await UserService.updateUser(req.user.id, name, about);
    res.send({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      about: userData.about,
      email: userData.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.updateAvatar = async (req, res, next) => {
  try {
    const userData = await UserService.updateAvatar(
      req.files.file,
      req.user.id
    );
    res.send({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      about: userData.about,
      email: userData.email,
    });
  } catch (error) {
    next(error);
  }
};

module.exports.getCurrentUser = async (req, res, next) => {
  try {
    const userData = await UserService.getCurrentUser(req.user.id);
    res.send({
      id: userData.id,
      name: userData.name,
      avatar: userData.avatar,
      about: userData.about,
      email: userData.email,
      isActivated: userData.isActivated,
    });
  } catch (error) {
    next(error);
  }
};
