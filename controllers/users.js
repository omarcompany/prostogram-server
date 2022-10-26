const User = require("../models/user");

module.exports.createUser = (req, res) => {
  const { name, avatar, about } = req.body;
  User.create({
    name,
    avatar,
    about,
  })
    .then((user) => res.send(user))
    .catch((error) => res.status(500).send({ message: "Error" }));
};

module.exports.getUsers = (req, res) =>
  User.find({})
    .then((users) => res.send(users))
    .catch((error) => res.status(500).send({ message: "Error" }));

module.exports.getUserById = (req, res) => {
  User.findById(req.params.id)
    .then((user) => res.send(user))
    .catch((error) => res.status(500).send({ message: "Error" }));
};

module.exports.updateUser = (req, res) => {
  const { name } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    // remove later
    name,
  })
    .then((user) => res.send(user))
    .catch((error) => res.status(500).send({ message: "Error" }));
};

module.exports.updateAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, {
    //remove later
    avatar,
  })
    .then((user) => res.send(user))
    .catch((error) => res.status(500).send({ message: "Error" }));
};
