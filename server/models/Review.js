const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reviewed: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  tutoringAd: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TutoringAd'
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  title: {
    type: String,
    required: true,
    maxlength: 100
  },
  comment: {
    type: String,
    required: true,
    maxlength: 1000
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  helpful: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    isHelpful: Boolean
  }]
}, {
  timestamps: true
});

// Ensure one review per user per teacher
reviewSchema.index({ reviewer: 1, reviewed: 1 }, { unique: true });

// Index for efficient querying
reviewSchema.index({ reviewed: 1, createdAt: -1 });
reviewSchema.index({ rating: 1 });

module.exports = mongoose.model('Review', reviewSchema); 