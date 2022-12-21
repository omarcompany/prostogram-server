const jwt = require("jsonwebtoken");

const { SECRET_KEY, TOKEN_TYPE } = require("../constants/constants.js");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith(TOKEN_TYPE)) {
    throw new UnauthorizedError();
  }

  const token = authorization.replace(TOKEN_TYPE, "");

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new UnauthorizedError();
  }

  req.user = payload;

  next();
};
