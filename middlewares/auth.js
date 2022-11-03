const jwt = require("jsonwebtoken");

const { SECRET_KEY } = require("../constants/constants.js");
const UnauthorizedError = require("../errors/unauthorized-error");

module.exports = (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    throw new UnauthorizedError();
  }

  const token = authorization.replace("Bearer ", "");

  let payload;

  try {
    payload = jwt.verify(token, SECRET_KEY);
  } catch (error) {
    throw new UnauthorizedError();
  }

  req.user = payload;

  next();
};
