const Card = require("../models/card");
const { CARD_STATIC_PATH } = require("../settings");
const { ERROR_TYPE, HTTP_RESPONSE } = require("../constants/errors");
const ForbiddenError = require("../errors/forbidden-error");
const NotFoundError = require("../errors/not-found-error");
const { saveFileAndGetURN } = require("../utils");

const fs = require("fs");
const path = require("path");

module.exports.createCard = (req, res, next) => {
  const fileURN = saveFileAndGetURN(req.files.file, CARD_STATIC_PATH);

  const { name } = req.body;

  const owner = req.user._id;
  Card.create({
    name,
    urn: fileURN,
    owner,
  })
    .then((card) => res.send(card))
    .catch((err) => {
      if (err.name === ERROR_TYPE.cast || err.name === ERROR_TYPE.validity) {
        next(new BadRequestError());
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.getCards = (req, res, next) =>
  Card.find({})
    .then((cards) => {
      res.send(cards);
    })
    .catch(next);

module.exports.remove = async (req, res, next) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) {
      next(new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.card));
      return;
    }
    const roles = req.user.roles;
    const isAdmin = roles.includes("ADMIN");
    if (!isAdmin && !card.owner.equals(req.user._id)) {
      next(new ForbiddenError());
      return;
    }
    const removedCard = await Card.findByIdAndRemove(req.params.id);
    const cardPath = path.join(
      CARD_STATIC_PATH,
      path.basename(removedCard.urn)
    );
    fs.unlinkSync(cardPath);
    res.send(removedCard);
  } catch (error) {
    if (error.name === ERROR_TYPE.cast) {
      next(new BadRequestError());
      return;
    }
    next(error);
  }
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.card);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.cast) {
        next(new BadRequestError());
        return;
      }
      next(err);
    })
    .catch(next);
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.id,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .then((card) => {
      if (!card) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.card);
      }
      res.send(card);
    })
    .catch((err) => {
      if (err.name === ERROR_TYPE.cast) {
        next(new BadRequestError());
        return;
      }
      next(err);
    })
    .catch(next);
};
