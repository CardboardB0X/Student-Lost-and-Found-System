import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to sign JWT
const generateToken = (id) => {
  return jwt.sign(
    { id },
    process.env.JWT_SECRET || 'lostradar_academic_jwt_secret_key_2026_dcit26',
    { expiresIn: '30d' }
  );
};

// @desc    Register a new student/staff account
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, studentId, email, password, role, phone } = req.body;

    if (!name || !studentId || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide full name, student ID, email, and password'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      $or: [
        { email: email.toLowerCase().trim() },
        { studentId: studentId.toUpperCase().trim() }
      ]
    });

    if (existingUser) {
      const field = existingUser.email === email.toLowerCase().trim() ? 'Email' : 'Student ID';
      return res.status(400).json({
        success: false,
        message: `${field} is already registered. Please sign in instead.`
      });
    }

    // Only allow STUDENT or STAFF registration
    const userRole = role === 'STAFF' ? 'STAFF' : 'STUDENT';

    const user = await User.create({
      name: name.trim(),
      studentId: studentId.toUpperCase().trim(),
      email: email.toLowerCase().trim(),
      password,
      role: userRole,
      phone: phone ? phone.trim() : ''
    });

    const token = generateToken(user._id);

    return res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: 'Validation Error',
        errors: messages
      });
    }
    next(error);
  }
};

// @desc    Sign in user (supports email or student ID)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  try {
    const { identifier, password } = req.body;

    if (!identifier || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please enter your Student ID or Email and password'
      });
    }

    const cleanIdentifier = identifier.trim();

    // Search by email or studentId, select password
    const user = await User.findOne({
      $or: [
        { email: cleanIdentifier.toLowerCase() },
        { studentId: cleanIdentifier.toUpperCase() }
      ]
    }).select('+password');

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID/Email or password'
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid Student ID/Email or password'
      });
    }

    const token = generateToken(user._id);

    return res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        studentId: user.studentId,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  return res.status(200).json({
    success: true,
    user: {
      id: req.user._id,
      name: req.user.name,
      studentId: req.user.studentId,
      email: req.user.email,
      role: req.user.role,
      phone: req.user.phone
    }
  });
};
