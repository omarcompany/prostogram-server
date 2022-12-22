const { celebrate, Joi } = require("celebrate");
const router = require("express").Router();

const {
  createCard,
  getCards,
  remove,
  likeCard,
  dislikeCard,
} = require("../controllers/cards");

router.post(
  "/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30).required(),
    }),
  }),
  createCard
);
router.get("/", getCards);
router.delete(
  "/:id",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  remove
);
router.put(
  "/:id/likes",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  likeCard
);
router.delete(
  "/:id/likes",
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  dislikeCard
);

module.exports = router;
