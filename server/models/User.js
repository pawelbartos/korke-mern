const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['teacher', 'student', 'admin'],
    default: 'student'
  },
  phone: {
    type: String,
    trim: true
  },
  avatar: {
    type: String,
    default: ''
  },
  bio: {
    type: String,
    maxlength: 500
  },
  location: {
    city: String,
    address: String,
    coordinates: {
      lat: Number,
      lng: Number
    }
  },
  // Dla nauczycieli
  subjects: [{
    name: String,
    level: {
      type: String,
      enum: ['podstawowy', 'średni', 'zaawansowany']
    },
    experience: Number // lata doświadczenia
  }],
  education: [{
    degree: String,
    institution: String,
    year: Number
  }],
  hourlyRate: {
    type: Number,
    min: 0
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
  // Dla wszystkich użytkowników
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
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  // Ulubione ogłoszenia
  favorites: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'TutoringAd'
  }]
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return `${this.firstName} ${this.lastName}`;
});

// Ensure virtual fields are serialized
userSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret.password;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema); 