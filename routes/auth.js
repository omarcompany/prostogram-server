const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { createUser, login } = require("../controllers/users");
const { URL_REG_EXP } = require("../constants/constants");

router.post(
  "/signup",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().min(2).max(30),
      about: Joi.string().min(2).max(30),
      avatar: Joi.string().uri().regex(URL_REG_EXP),
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  createUser
);
router.post(
  "/signin",
  celebrate({
    body: Joi.object().keys({
      email: Joi.string().required().email(),
      password: Joi.string().required(),
    }),
  }),
  login
);

module.exports = router;
