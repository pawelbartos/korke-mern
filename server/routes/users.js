const express = require('express');
const { body, validationResult } = require('express-validator');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password');
    res.json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', [
  auth,
  body('firstName').optional().trim().notEmpty(),
  body('lastName').optional().trim().notEmpty(),
  body('phone').optional().trim(),
  body('bio').optional().trim().isLength({ max: 500 }),
  body('location.city').optional().trim(),
  body('location.address').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findById(req.user._id);

    Object.keys(updates).forEach(key => {
      if (updates[key] !== undefined) {
        user[key] = updates[key];
      }
    });

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   PUT /api/users/profile/teacher
// @desc    Update teacher-specific profile
// @access  Private (Teachers only)
router.put('/profile/teacher', [
  auth,
  requireRole(['teacher']),
  body('subjects').optional().isArray(),
  body('education').optional().isArray(),
  body('hourlyRate').optional().isNumeric().isFloat({ min: 0 }),
  body('availability').optional().isArray()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const updates = req.body;
    const user = await User.findById(req.user._id);

    if (updates.subjects) user.subjects = updates.subjects;
    if (updates.education) user.education = updates.education;
    if (updates.hourlyRate !== undefined) user.hourlyRate = updates.hourlyRate;
    if (updates.availability) user.availability = updates.availability;

    await user.save();

    const updatedUser = await User.findById(user._id).select('-password');
    res.json(updatedUser);
  } catch (error) {
    console.error('Update teacher profile error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/users/teachers
// @desc    Get all teachers with filters
// @access  Public
router.get('/teachers', async (req, res) => {
  try {
    const {
      subject,
      city,
      minRating,
      maxPrice,
      page = 1,
      limit = 10
    } = req.query;

    const filter = { role: 'teacher', isActive: true };
    
    if (subject) {
      filter['subjects.name'] = { $regex: subject, $options: 'i' };
    }
    if (city) {
      filter['location.city'] = { $regex: city, $options: 'i' };
    }
    if (minRating) {
      filter['rating.average'] = { $gte: Number(minRating) };
    }
    if (maxPrice) {
      filter.hourlyRate = { $lte: Number(maxPrice) };
    }

    const skip = (page - 1) * limit;
    
    const teachers = await User.find(filter)
      .select('-password -email')
      .sort({ 'rating.average': -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(filter);

    res.json({
      teachers,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get teachers error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/users/:id
// @desc    Get user profile by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -email')
      .populate('subjects')
      .populate('education');

    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router; 