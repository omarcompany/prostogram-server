const { HTTP_RESPONSE } = require("../constants/errors");

module.exports = (err, req, res, next) => {
  const { statusCode = HTTP_RESPONSE.internalError, message } = err;

  res.status(err.statusCode).send({
    message:
      statusCode === HTTP_RESPONSE.internalError
        ? HTTP_RESPONSE.internalError.message
        : message,
  });
  next();
};
