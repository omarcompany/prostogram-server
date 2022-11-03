const { HTTP_RESPONSE } = require("../constants/errors");

class ForbiddenError extends Error {
  constructor(message = HTTP_RESPONSE.forbidden.message) {
    super(message);
    this.statusCode = HTTP_RESPONSE.forbidden.status;
  }
}

module.exports = ForbiddenError;
