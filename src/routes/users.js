const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const { getUserById } = require('../controllers/users');

router.get(
  '/:id',
  celebrate({
    params: Joi.object().keys({
      id: Joi.string().hex().length(24).required(),
    }),
  }),
  getUserById
);

module.exports = router;
