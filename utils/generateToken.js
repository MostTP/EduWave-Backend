const jwt = require('jsonwebtoken');

// Generate JWT Access Token
const generateAccessToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_ACCESS_SECRET || 'your-access-secret-key', {
    expiresIn: process.env.JWT_ACCESS_EXPIRE || '15m',
  });
};

// Generate JWT Refresh Token
const generateRefreshToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_REFRESH_SECRET || 'your-refresh-secret-key', {
    expiresIn: process.env.JWT_REFRESH_EXPIRE || '7d',
  });
};

// Generate both tokens
const generateTokens = (userId) => {
  const accessToken = generateAccessToken(userId);
  const refreshToken = generateRefreshToken(userId);
  return { accessToken, refreshToken };
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  generateTokens,
};


