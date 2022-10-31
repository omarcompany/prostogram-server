const bcrypt = require("bcryptjs");

const User = require("../models/user");
const NotFoundError = require("../errors/not-found-error");
const BadRequestError = require("../errors/bad-request-error");
const { ERROR_TYPE, HTTP_RESPONSE } = require("../constants/errors");

module.exports.createUser = (req, res) => {
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

module.exports.getUsers = (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch(next);

module.exports.getUserById = (req, res) => {
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

module.exports.updateUser = (req, res) => {
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

module.exports.updateAvatar = (req, res) => {
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
