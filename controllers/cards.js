const Card = require("../models/card");

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  const owner = req.user._id; // Hack! Will be removed later
  Card.create({
    name,
    link,
    owner,
  })
    .then((card) => res.send(card))
    .catch((error) => res.status(500).send({ message: "Error" }));
};

module.exports.getCards = (req, res) =>
  Card.find({})
    .then((cards) => res.send(cards))
    .catch((error) => res.status(500).send({ message: "Error" }));

module.exports.remove = (req, res) => {
  Card.findByIdAndRemove(req.params.id)
    .then((card) => res.send(card))
    .catch((error) => res.status(500).send({ message: "Error" }));
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((error) => res.status(500).send({ message: "Error" }));
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => res.send(card))
    .catch((error) => res.status(500).send({ message: "Error" }));
};
