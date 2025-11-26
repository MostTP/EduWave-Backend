const express = require('express');
const router = express.Router();
const {
  register,
  login,
  verifyEmail,
} = require('../controllers/authController');

// @route   POST /auth/register
// @desc    Register a new user
// @access  Public
router.post('/register', register);

// @route   POST /auth/login
// @desc    Login user
// @access  Public
router.post('/login', login);

// @route   GET /auth/verify-email/:token
// @desc    Verify email address
// @access  Public
router.get('/verify-email/:token', verifyEmail);

module.exports = router;


