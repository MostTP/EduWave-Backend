const crypto = require('crypto');

const generateVerificationToken = () => {
  // Generate random token
  const verificationToken = crypto.randomBytes(32).toString('hex');
  
  // Hash token and set to emailVerificationToken field
  const hashedToken = crypto
    .createHash('sha256')
    .update(verificationToken)
    .digest('hex');

  return { verificationToken, hashedToken };
};

module.exports = generateVerificationToken;


