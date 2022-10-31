const HTTP_RESPONSE = require("../constants/errors");

class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = HTTP_RESPONSE.notFound;
  }
}

module.exports = NotFoundError;
