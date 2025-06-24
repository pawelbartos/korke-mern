const mongoose = require('mongoose');

const tutoringAdSchema = new mongoose.Schema({
  teacher: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  description: {
    type: String,
    required: true,
    maxlength: 2000
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  level: {
    type: String,
    enum: ['podstawowy', 'średni', 'zaawansowany'],
    required: true
  },
  price: {
    amount: {
      type: Number,
      required: true,
      min: 0
    },
    currency: {
      type: String,
      default: 'PLN'
    },
    perHour: {
      type: Boolean,
      default: true
    }
  },
  location: {
    type: {
      type: String,
      enum: ['online', 'offline', 'both'],
      default: 'both'
    },
    city: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  availability: [{
    day: {
      type: String,
      enum: ['poniedziałek', 'wtorek', 'środa', 'czwartek', 'piątek', 'sobota', 'niedziela']
    },
    timeSlots: [{
      start: String,
      end: String
    }]
  }],
  images: [{
    url: String,
    caption: String
  }],
  tags: [String],
  isActive: {
    type: Boolean,
    default: true
  },
  views: {
    type: Number,
    default: 0
  },
  applications: [{
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    message: String,
    status: {
      type: String,
      enum: ['pending', 'accepted', 'rejected'],
      default: 'pending'
    },
    appliedAt: {
      type: Date,
      default: Date.now
    }
  }],
  rating: {
    average: {
      type: Number,
      default: 0,
      min: 0,
      max: 5
    },
    count: {
      type: Number,
      default: 0
    }
  }
}, {
  timestamps: true
});

// Index for search functionality
tutoringAdSchema.index({
  title: 'text',
  description: 'text',
  subject: 'text',
  tags: 'text'
});

// Virtual for formatted price
tutoringAdSchema.virtual('formattedPrice').get(function() {
  return `${this.price.amount} ${this.price.currency}${this.price.perHour ? '/h' : ''}`;
});

// Ensure virtual fields are serialized
tutoringAdSchema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('TutoringAd', tutoringAdSchema); 