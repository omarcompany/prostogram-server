const { HTTP_RESPONSE } = require("../constants/errors");

class BadRequestError extends Error {
  constructor(message = HTTP_RESPONSE.badRequest.message) {
    super(message);
    this.statusCode = HTTP_RESPONSE.badRequest.status;
  }
}

module.exports = BadRequestError;
