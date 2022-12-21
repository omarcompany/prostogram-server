const SECRET_KEY = "some-secret-key";
const URL_REG_EXP =
  /^(https?:\/\/)(www\.)?([a-z1-9-]{2,}\.)+[a-z]{2,}\/?[a-z0-9-._~:/?#[\]@!$&'()*+,;=]*/i;

const TOKEN_TYPE = "Bearer ";

module.exports = {
  SECRET_KEY,
  URL_REG_EXP,
  TOKEN_TYPE,
};
