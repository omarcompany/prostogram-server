const jwt = require('jsonwebtoken');

const Token = require('../models/token');

const {
  JWT_ACCESS_SECRET,
  JWT_REFRESH_SECRET,
} = require('../constants/constants.js');

const generateTokens = (payload) => {
  const accessToken = jwt.sign(payload, JWT_ACCESS_SECRET, {
    expiresIn: '15m',
  });
  const refreshToken = jwt.sign(payload, JWT_REFRESH_SECRET, {
    expiresIn: '30d',
  });

  return {
    accessToken,
    refreshToken,
  };
};

const saveRefreshToken = async (userId, refreshToken) => {
  try {
    const tokenData = await Token.findOne({ user: userId });

    if (tokenData) {
      tokenData.refreshToken = refreshToken;
      return tokenData.save();
    }

    await Token.create({ user: userId, refreshToken });
  } catch (error) {
    throw error;
  }
};

const removeRefreshToken = async (refreshToken) => {
  try {
    const tokenData = await Token.deleteOne({ refreshToken });
    return tokenData;
  } catch (error) {
    throw error;
  }
};

const validateToken = (token, secretKey) => {
  try {
    const userData = jwt.verify(token, secretKey);
    return userData;
  } catch (error) {
    return null;
  }
};

const validateRefreshToken = (token) => {
  return validateToken(token, JWT_REFRESH_SECRET);
};

const validateAccessToken = (token) => {
  return validateToken(token, JWT_ACCESS_SECRET);
};

const findToken = async (refreshToken) => {
  try {
    const tokenData = await Token.findOne({ refreshToken });
    return tokenData;
  } catch (error) {
    return null;
  }
};

module.exports = {
  generateTokens,
  saveRefreshToken,
  removeRefreshToken,
  validateRefreshToken,
  validateAccessToken,
  findToken,
};
