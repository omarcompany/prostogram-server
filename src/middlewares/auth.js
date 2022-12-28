const TokenService = require('../services/token-service');
const { TOKEN_TYPE } = require('../constants/constants.js');
const UnauthorizedError = require('../errors/unauthorized-error');
const User = require('../models/user');

module.exports = async (req, res, next) => {
  try {
    const { authorization } = req.headers;

    if (!authorization || !authorization.startsWith(TOKEN_TYPE)) {
      return next(new UnauthorizedError());
    }

    const token = authorization.replace(TOKEN_TYPE, '');

    const userData = TokenService.validateAccessToken(token);
    if (!userData) {
      return next(new UnauthorizedError());
    }

    req.user = userData;

    const user = await User.findById(userData.id);
    req.user.roles = user.roles;

    next();
  } catch (error) {
    return next(error);
  }
};
