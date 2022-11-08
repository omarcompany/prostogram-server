const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { URL_REG_EXP } = require("../constants/constants");
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
      link: Joi.string().uri().regex(URL_REG_EXP).required(),
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
