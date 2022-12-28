const { HTTP_RESPONSE } = require("../constants/errors");

class UnauthorizedError extends Error {
  constructor(message = HTTP_RESPONSE.unauthorized.message) {
    super(message);
    this.statusCode = HTTP_RESPONSE.unauthorized.status;
  }
}

module.exports = UnauthorizedError;
