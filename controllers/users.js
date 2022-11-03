const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../constants/constants.js");
const BadRequestError = require("../errors/bad-request-error");
const { ERROR_TYPE, HTTP_RESPONSE } = require("../constants/errors");
const NotFoundError = require("../errors/not-found-error");
const User = require("../models/user");

module.exports.createUser = (req, res, next) => {
  const { name, avatar, about, email, password } = req.body;
  bcrypt.hash(password, 10).then((hash) => {
    User.create({
      name,
      avatar,
      about,
      email,
      password: hash,
    })
      .then((user) => res.send(user))
      .catch((err) => {
        if (err.name === ERROR_TYPE.validity || err.name === ERROR_TYPE.cast) {
          next(new BadRequestError());
          return;
        }
        next(err);
      })
      .catch(next);
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
      res.send(user);
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
  const { name } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    name,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
      }
      res.send(user);
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
  User.findByIdAndUpdate(req.user._id, {
    avatar,
  })
    .then((user) => {
      if (!user) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.user);
      }
      res.send(user);
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

  User.findUserByCredentials({ email, password })
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, SECRET_KEY, {
        expiresIn: 3600,
      });
      res.send({ token });
    })
    .catch(next);
};

module.exports.getCurrentUser = (req, res, next) => {
  const { _id } = req.user;

  User.findById(_id)
    .then((user) => {
      res.send(user);
    })
    .catch(next);
};
