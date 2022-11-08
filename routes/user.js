const router = require("express").Router();
const { celebrate, Joi } = require("celebrate");

const { URL_REG_EXP } = require("../constants/constants");
const {
  updateAvatar,
  updateUser,
  getCurrentUser,
} = require("../controllers/users");

router.get("/me/", getCurrentUser);
router.patch(
  "/me/",
  celebrate({
    body: Joi.object().keys({
      name: Joi.string().required().min(2).max(30),
      about: Joi.string().required().min(2).max(30),
    }),
  }),
  updateUser
);
router.patch(
  "/me/avatar",
  celebrate({
    body: Joi.object().keys({
      avatar: Joi.string().uri().regex(URL_REG_EXP).required(),
    }),
  }),
  updateAvatar
);

module.exports = router;
