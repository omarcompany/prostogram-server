const NotFoundError = require("../errors/not-found-error");
const ForbiddenError = require("../errors/forbidden-error");
const Card = require("../models/card");
const { ERROR_TYPE, HTTP_RESPONSE } = require("../constants/errors");

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  const owner = req.user._id;
  Card.create({
    name,
    link,
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
    .then((cards) => res.send(cards))
    .catch(next);

module.exports.remove = (req, res, next) => {
  Card.findById(req.params.id)
    .then((card) => {
      if (!card) {
        throw new NotFoundError(HTTP_RESPONSE.notFound.absentedMessage.card);
      }
      if (!card.owner.equals(req.user._id)) {
        throw new ForbiddenError();
      }

      Card.findByIdAndRemove(req.params.id)
        .then((card) => {
          if (!card) {
            throw new ForbiddenError();
          }
          res.send(card);
        })
        .catch((err) => {
          if (err.name === ERROR_TYPE.cast) {
            next(new BadRequestError());
            return;
          }
          next(err);
        });
    })
    .catch(next);
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
