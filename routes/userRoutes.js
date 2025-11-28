const express = require('express');
const router = express.Router();
const User = require('../models/User');
const { protect, authorize } = require('../middleware/auth');

// GET current user profile - All authenticated users
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password -refreshToken -emailVerificationToken');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET all users - Admin and Instructor can view all users
router.get('/', protect, authorize('admin', 'instructor'), async (req, res) => {
  try {
    const users = await User.find().select('-password -refreshToken -emailVerificationToken');
    res.json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// GET a single user by ID - Users can view their own profile, admins and instructors can view any
router.get('/:id', protect, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -refreshToken -emailVerificationToken');
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    // Users can only view their own profile unless they're admin or instructor
    if (req.user.role !== 'admin' && req.user.role !== 'instructor' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to view this user profile' 
      });
    }
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

// POST create a new user - Admin only
router.post('/', protect, authorize('admin'), async (req, res) => {
  try {
    const { fullName, email, password, role } = req.body;
    
    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide fullName, email, and password',
      });
    }
    
    // Validate role if provided
    if (role && !['user', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid role. Must be one of: user, instructor, admin',
      });
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User already exists with this email',
      });
    }
    
    const userData = {
      fullName,
      email,
      password,
      role: role || 'user',
      emailVerified: true, // Admin-created users are auto-verified
    };
    
    const newUser = await User.create(userData);
    
    // Remove sensitive fields from response
    newUser.password = undefined;
    newUser.refreshToken = undefined;
    newUser.emailVerificationToken = undefined;
    
    res.status(201).json({
      success: true,
      data: newUser,
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// PUT update a user - Users can update their own profile, admins can update any
router.put('/:id', protect, async (req, res) => {
  try {
    // Users can only update their own profile unless they're admin
    if (req.user.role !== 'admin' && req.user._id.toString() !== req.params.id) {
      return res.status(403).json({ 
        success: false,
        message: 'Not authorized to update this user profile' 
      });
    }
    
    // Only admins can change roles
    const updateData = {
      fullName: req.body.fullName,
      email: req.body.email,
    };
    
    // Only admins can change roles
    if (req.user.role === 'admin' && req.body.role) {
      if (!['user', 'instructor', 'admin'].includes(req.body.role)) {
        return res.status(400).json({
          success: false,
          message: 'Invalid role. Must be one of: user, instructor, admin',
        });
      }
      updateData.role = req.body.role;
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -refreshToken -emailVerificationToken');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// PUT update user role - Admin only
router.put('/:id/role', protect, authorize('admin'), async (req, res) => {
  try {
    const { role } = req.body;
    
    if (!role || !['user', 'instructor', 'admin'].includes(role)) {
      return res.status(400).json({ 
        success: false,
        message: 'Valid role (user, instructor, admin) is required' 
      });
    }
    
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true, runValidators: true }
    ).select('-password -refreshToken -emailVerificationToken');
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'User role updated successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(400).json({ 
      success: false,
      message: error.message 
    });
  }
});

// DELETE a user - Admin only
router.delete('/:id', protect, authorize('admin'), async (req, res) => {
  try {
    // Prevent admin from deleting themselves
    if (req.user._id.toString() === req.params.id) {
      return res.status(400).json({
        success: false,
        message: 'You cannot delete your own account',
      });
    }
    
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: 'User not found' 
      });
    }
    
    res.json({ 
      success: true,
      message: 'User deleted successfully' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false,
      message: error.message 
    });
  }
});

module.exports = router;

