const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  API_URL,
  CLIENT_URL,
} = require('config');

const URL_REG_EXP =
  /^(https?:\/\/)(www\.)?([a-z1-9-]{2,}\.)+[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*/i;

const TOKEN_TYPE = 'Bearer ';

module.exports = {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
  TOKEN_TYPE,
  SMTP_HOST,
  SMTP_PORT,
  SMTP_USER,
  SMTP_PASSWORD,
  API_URL,
  CLIENT_URL,
  URL_REG_EXP,
  TOKEN_TYPE,
};
