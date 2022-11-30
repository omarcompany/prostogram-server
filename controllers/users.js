const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../constants/constants.js");
const BadRequestError = require("../errors/bad-request-error");
const { ERROR_TYPE, HTTP_RESPONSE } = require("../constants/errors");
const NotFoundError = require("../errors/not-found-error");
const Role = require("../models/role");
const User = require("../models/user");
const UnauthorizedError = require("../errors/unauthorized-error.js");

const generateAccessToken = (_id, roles) => {
  const payload = { _id, roles };
  return jwt.sign(payload, SECRET_KEY, {
    expiresIn: 3600,
  });
};

module.exports.createUser = (req, res, next) => {
  const { name, avatar, about, email, password } = req.body;

  const isAdmin = email === "admin@mail.com";

  Role.find({}).then((items) => {
    const [user, admin] = items;

    const roles = isAdmin ? [user.value, admin.value] : [user.value];

    bcrypt.hash(password, 10).then((hash) => {
      User.create({
        name,
        avatar,
        about,
        email,
        password: hash,
        roles,
      })
        .then((user) =>
          res.send({
            _id: user._id,
            name: user.name,
            avatar: user.avatar,
            about: user.about,
            email: user.email,
          })
        )
        .catch((err) => {
          if (
            err.name === ERROR_TYPE.validity ||
            err.name === ERROR_TYPE.cast
          ) {
            next(new BadRequestError());
            return;
          }
          next(err);
        })
        .catch(next);
    });
  });
};

module.exports.getUsers = (req, res, next) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(next);

module.exports.getUserById = (req, res, next) => {
  User.findById(req.params.id)
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
      }
      res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        about: user.about,
      });
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.cast) {
        next(new BadRequestError());
        return;
      }
      next();
    })
    .catch(next);
};

module.exports.updateUser = (req, res, next) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      name,
      about,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
      }
      res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        about: user.about,
      });
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        next(new BadRequestError());
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.updateAvatar = (req, res, next) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    {
      avatar,
    },
    { new: true }
  )
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
      }
      res.send({
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
        about: user.about,
      });
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
        next(new BadRequestError());
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.login = (req, res, next) => {
  const { email, password } = req.body;

  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = generateAccessToken(user._id, user.roles);
      res.send({ token });
    })
    .catch(() => next(new UnauthorizedError()));
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;
  User.findById(_id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
