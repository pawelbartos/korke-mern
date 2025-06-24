const express = require('express');
const { body, validationResult } = require('express-validator');
const Review = require('../models/Review');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/reviews/user/:userId
// @desc    Get reviews for a specific user
// @access  Public
router.get('/user/:userId', async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const reviews = await Review.find({ reviewed: req.params.userId })
      .populate('reviewer', 'firstName lastName avatar')
      .populate('tutoringAd', 'title subject')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Review.countDocuments({ reviewed: req.params.userId });

    res.json({
      reviews,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', [
  auth,
  body('reviewed').isMongoId(),
  body('rating').isInt({ min: 1, max: 5 }),
  body('title').notEmpty().trim().isLength({ max: 100 }),
  body('comment').notEmpty().trim().isLength({ max: 1000 }),
  body('tutoringAd').optional().isMongoId()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { reviewed, rating, title, comment, tutoringAd } = req.body;
    const reviewer = req.user._id;

    // Check if user is reviewing themselves
    if (reviewer.toString() === reviewed) {
      return res.status(400).json({ message: 'Nie możesz ocenić samego siebie' });
    }

    // Check if reviewed user exists
    const reviewedUser = await User.findById(reviewed);
    if (!reviewedUser) {
      return res.status(404).json({ message: 'Oceniany użytkownik nie został znaleziony' });
    }

    // Check if already reviewed
    const existingReview = await Review.findOne({ reviewer, reviewed });
    if (existingReview) {
      return res.status(400).json({ message: 'Już oceniłeś tego użytkownika' });
    }

    const review = new Review({
      reviewer,
      reviewed,
      rating,
      title,
      comment,
      tutoringAd
    });

    await review.save();

    // Update user's average rating
    const userReviews = await Review.find({ reviewed });
    const averageRating = userReviews.reduce((sum, rev) => sum + rev.rating, 0) / userReviews.length;
    
    await User.findByIdAndUpdate(reviewed, {
      'rating.average': averageRating,
      'rating.count': userReviews.length
    });

    const populatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('tutoringAd', 'title subject');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private (Review owner only)
router.put('/:id', [
  auth,
  body('rating').optional().isInt({ min: 1, max: 5 }),
  body('title').optional().trim().isLength({ max: 100 }),
  body('comment').optional().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Recenzja nie została znaleziona' });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    Object.assign(review, req.body);
    await review.save();

    // Update user's average rating
    const userReviews = await Review.find({ reviewed: review.reviewed });
    const averageRating = userReviews.reduce((sum, rev) => sum + rev.rating, 0) / userReviews.length;
    
    await User.findByIdAndUpdate(review.reviewed, {
      'rating.average': averageRating,
      'rating.count': userReviews.length
    });

    const updatedReview = await Review.findById(review._id)
      .populate('reviewer', 'firstName lastName avatar')
      .populate('tutoringAd', 'title subject');

    res.json(updatedReview);
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private (Review owner only)
router.delete('/:id', auth, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Recenzja nie została znaleziona' });
    }

    if (review.reviewer.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    const reviewedUserId = review.reviewed;
    await review.remove();

    // Update user's average rating
    const userReviews = await Review.find({ reviewed: reviewedUserId });
    const averageRating = userReviews.length > 0 
      ? userReviews.reduce((sum, rev) => sum + rev.rating, 0) / userReviews.length 
      : 0;
    
    await User.findByIdAndUpdate(reviewedUserId, {
      'rating.average': averageRating,
      'rating.count': userReviews.length
    });

    res.json({ message: 'Recenzja została usunięta' });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/reviews/:id/helpful
// @desc    Mark review as helpful/unhelpful
// @access  Private
router.post('/:id/helpful', [
  auth,
  body('isHelpful').isBoolean()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({ message: 'Recenzja nie została znaleziona' });
    }

    const { isHelpful } = req.body;
    const userId = req.user._id;

    // Remove existing helpful vote
    review.helpful = review.helpful.filter(h => h.user.toString() !== userId.toString());
    
    // Add new helpful vote
    review.helpful.push({ user: userId, isHelpful });
    
    await review.save();

    res.json(review);
  } catch (error) {
    console.error('Helpful vote error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router; 