const HTTP_RESPONSE = {
  badRequest: {
    status: 400,
    message: `Invalid data type, length or doesn't have required fields`,
  },
  notFound: {
    status: 404,
    message: 'Invalid URL',
    absentedMessage: {
      user: 'User id is not found ',
      card: 'Card id is not found',
    },
  },
  internalError: { status: 500, message: 'Server error' },
  unauthorized: { status: 401, message: 'You need authorization' },
  forbidden: {
    status: 403,
    message: 'Access is denied',
    absentMessage: {
      noActivation: 'You need activate your account email',
    },
  },
};

const ERROR_TYPE = {
  cast: 'CastError',
  validity: 'ValidationError',
};

module.exports = { ERROR_TYPE, HTTP_RESPONSE };
