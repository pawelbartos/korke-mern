const express = require('express');
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth } = require('../middleware/auth');
const { generateOTP, storeOTP, verifyOTP, sendOTP } = require('../services/otpService');

const router = express.Router();

// Test endpoint
router.get('/test', (req, res) => {
  res.json({ message: 'Auth API is working!', timestamp: new Date().toISOString() });
});

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign(
    { userId },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// @route   POST /api/auth/send-otp
// @desc    Send OTP to user's email (create account if doesn't exist)
// @access  Public
router.post('/send-otp', [
  body('email').isEmail().normalizeEmail(),
  body('firstName').optional().notEmpty().trim(),
  body('lastName').optional().notEmpty().trim(),
  body('role').optional().isIn(['teacher', 'student'])
], async (req, res) => {
  try {
    console.log('📧 Send OTP request received:', req.body);
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, firstName, lastName, role } = req.body;
    console.log('📧 Processing OTP request for:', email);

    let user;
    let isNewUser = false;
    
    // Check if user exists in MongoDB Atlas
    user = await User.findOne({ email });
    console.log('🔍 Found existing user in database:', user ? 'Yes' : 'No');
    
    // If user doesn't exist and we have user data, create new user
    if (!user && firstName && lastName && role) {
      user = new User({
        email,
        password: Math.random().toString(36).slice(-10), // Generate random password
        firstName,
        lastName,
        role,
        isActive: true
      });
      await user.save();
      isNewUser = true;
      console.log('✅ Created new database user:', user._id);
    }
    
    if (!user) {
      console.log('❌ User not found and no registration data provided');
      return res.status(400).json({ 
        message: 'Aby utworzyć konto, podaj imię, nazwisko i rolę',
        requiresRegistration: true 
      });
    }

    // Generate and store OTP
    console.log('🔐 Generating OTP...');
    const otp = generateOTP();
    const userData = isNewUser ? { firstName, lastName, role } : null;
    storeOTP(email, otp, userData);
    console.log('✅ OTP stored successfully');

    // Send OTP
    console.log('📧 Sending OTP...');
    const sendResult = await sendOTP(email, otp, isNewUser);
    
    if (!sendResult.success) {
      console.error('❌ Failed to send OTP:', sendResult.error);
    } else {
      console.log('✅ OTP sent successfully');
    }

    const response = {
      message: isNewUser 
        ? 'Konto zostało utworzone i kod OTP został wysłany'
        : 'Kod OTP został wysłany na podany adres email',
      email: email,
      isNewUser
    };

    console.log('✅ Send OTP successful, sending response');
    res.json(response);
  } catch (error) {
    console.error('💥 Send OTP error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/auth/verify-otp
// @desc    Verify OTP and login user
// @access  Public
router.post('/verify-otp', [
  body('email').isEmail().normalizeEmail(),
  body('otp').isLength({ min: 6, max: 6 }).isNumeric()
], async (req, res) => {
  try {
    console.log('🔐 Verify OTP request received:', { email: req.body.email, otp: req.body.otp });
    
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log('❌ Validation errors:', errors.array());
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, otp } = req.body;
    console.log('📧 Processing OTP verification for:', email);

    // Check if user exists in MongoDB Atlas
    const user = await User.findOne({ email });
    console.log('🔍 Found user in database:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found for email:', email);
      return res.status(404).json({ message: 'Użytkownik z tym adresem email nie istnieje' });
    }

    // Verify OTP
    console.log('🔐 Verifying OTP...');
    const verificationResult = verifyOTP(email, otp);
    console.log('🔐 OTP verification result:', verificationResult);
    
    if (!verificationResult.valid) {
      console.log('❌ OTP verification failed:', verificationResult.message);
      return res.status(400).json({ message: verificationResult.message });
    }

    // Check if user is active
    if (!user.isActive) {
      console.log('❌ User account is inactive');
      return res.status(400).json({ message: 'Konto zostało dezaktywowane' });
    }

    // Generate token
    console.log('🎫 Generating JWT token...');
    const token = generateToken(user._id);
    console.log('✅ Token generated successfully');

    const response = {
      message: 'Logowanie OTP pomyślne',
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
        fullName: user.fullName,
        avatar: user.avatar,
        rating: user.rating
      }
    };

    console.log('✅ OTP verification successful, sending response');
    res.json(response);
  } catch (error) {
    console.error('💥 Verify OTP error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/auth/resend-otp
// @desc    Resend OTP to user's email
// @access  Public
router.post('/resend-otp', [
  body('email').isEmail().normalizeEmail()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email } = req.body;

    // Check if user exists in MongoDB Atlas
    const user = await User.findOne({ email });
    
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik z tym adresem email nie istnieje' });
    }

    // Generate and store new OTP
    const otp = generateOTP();
    storeOTP(email, otp);

    // Send new OTP
    const sendResult = await sendOTP(email, otp, false);
    
    if (!sendResult.success) {
      console.error('Failed to send OTP:', sendResult.error);
    }

    res.json({
      message: 'Nowy kod OTP został wysłany',
      email: email
    });
  } catch (error) {
    console.error('Resend OTP error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    // Get user from MongoDB Atlas
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/auth/logout
// @desc    Logout user (client-side token removal)
// @access  Private
router.post('/logout', auth, (req, res) => {
  res.json({ message: 'Wylogowano pomyślnie' });
});

module.exports = router; 