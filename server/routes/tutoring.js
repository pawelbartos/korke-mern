const express = require('express');
const { body, validationResult } = require('express-validator');
const TutoringAd = require('../models/TutoringAd');
const User = require('../models/User');
const { auth, requireRole } = require('../middleware/auth');
const Review = require('../models/Review');

const router = express.Router();

// @route   GET /api/tutoring
// @desc    Get all tutoring ads with filters
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      subject,
      level,
      city,
      minPrice,
      maxPrice,
      locationType,
      page = 1,
      limit = 10,
      sort = 'createdAt'
    } = req.query;

    const filter = { isActive: true };
    
    if (subject) filter.subject = { $regex: subject, $options: 'i' };
    if (level) filter.level = level;
    if (city) filter['location.city'] = { $regex: city, $options: 'i' };
    if (locationType) filter['location.type'] = locationType;
    if (minPrice || maxPrice) {
      filter['price.amount'] = {};
      if (minPrice) filter['price.amount'].$gte = Number(minPrice);
      if (maxPrice) filter['price.amount'].$lte = Number(maxPrice);
    }

    const skip = (page - 1) * limit;
    
    const ads = await TutoringAd.find(filter)
      .populate('teacher', 'firstName lastName avatar rating bio')
      .sort(sort === 'price' ? { 'price.amount': 1 } : { [sort]: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await TutoringAd.countDocuments(filter);

    res.json({
      ads,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Get ads error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/tutoring/search
// @desc    Search tutoring ads
// @access  Public
router.get('/search', async (req, res) => {
  try {
    const { q, page = 1, limit = 10 } = req.query;
    
    if (!q) {
      return res.status(400).json({ message: 'Query parameter is required' });
    }

    const skip = (page - 1) * limit;
    
    const ads = await TutoringAd.find(
      { $text: { $search: q }, isActive: true },
      { score: { $meta: 'textScore' } }
    )
    .populate('teacher', 'firstName lastName avatar rating bio')
    .sort({ score: { $meta: 'textScore' } })
    .skip(skip)
    .limit(Number(limit));

    const total = await TutoringAd.countDocuments({ $text: { $search: q }, isActive: true });

    res.json({
      ads,
      pagination: {
        current: Number(page),
        pages: Math.ceil(total / limit),
        total
      }
    });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/tutoring/favorites
// @desc    Get user's favorite ads
// @access  Private
router.get('/favorites', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    
    if (!user) {
      return res.status(404).json({ message: 'Użytkownik nie został znaleziony' });
    }

    const favoriteAds = user.favorites.filter(ad => ad && ad.isActive);

    res.json({
      ads: favoriteAds,
      total: favoriteAds.length
    });
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/tutoring/applications/my
// @desc    Get user's own applications (student only)
// @access  Private
router.get('/applications/my', [auth, requireRole(['student'])], async (req, res) => {
  try {
    const ads = await TutoringAd.find({
      'applications.student': req.user._id
    }).populate('teacher', 'firstName lastName');

    const applications = ads.flatMap(ad => 
      ad.applications
        .filter(app => app.student.toString() === req.user._id.toString())
        .map(app => ({
          _id: app._id,
          adId: ad._id,
          ad: {
            _id: ad._id,
            title: ad.title,
            subject: ad.subject,
            teacher: ad.teacher
          },
          message: app.message,
          preferredTime: app.preferredTime,
          preferredLocation: app.preferredLocation,
          status: app.status,
          createdAt: app.createdAt,
          updatedAt: app.updatedAt
        }))
    );

    res.json({
      applications,
      total: applications.length
    });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/tutoring
// @desc    Create new tutoring ad
// @access  Private (Teachers only)
router.post('/', [
  auth,
  requireRole(['teacher']),
  body('title').notEmpty().trim().isLength({ max: 100 }),
  body('description').notEmpty().trim().isLength({ max: 2000 }),
  body('subject').notEmpty().trim(),
  body('level').isIn(['podstawowy', 'średni', 'zaawansowany']),
  body('price.amount').isNumeric().isFloat({ min: 0 }),
  body('location.type').isIn(['online', 'offline', 'both'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ad = new TutoringAd({
      ...req.body,
      teacher: req.user._id
    });

    await ad.save();

    const populatedAd = await TutoringAd.findById(ad._id)
      .populate('teacher', 'firstName lastName avatar rating bio');

    res.status(201).json(populatedAd);
  } catch (error) {
    console.error('Create ad error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   PUT /api/tutoring/:id
// @desc    Update tutoring ad
// @access  Private (Ad owner only)
router.put('/:id', [
  auth,
  requireRole(['teacher']),
  body('title').optional().trim().isLength({ max: 100 }),
  body('description').optional().trim().isLength({ max: 2000 }),
  body('subject').optional().trim(),
  body('level').optional().isIn(['podstawowy', 'średni', 'zaawansowany']),
  body('price.amount').optional().isNumeric().isFloat({ min: 0 }),
  body('location.type').optional().isIn(['online', 'offline', 'both'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ad = await TutoringAd.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione' });
    }

    if (ad.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    Object.assign(ad, req.body);
    await ad.save();

    const updatedAd = await TutoringAd.findById(ad._id)
      .populate('teacher', 'firstName lastName avatar rating bio');

    res.json(updatedAd);
  } catch (error) {
    console.error('Update ad error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   DELETE /api/tutoring/:id
// @desc    Delete tutoring ad
// @access  Private (Ad owner only)
router.delete('/:id', [auth, requireRole(['teacher'])], async (req, res) => {
  try {
    const ad = await TutoringAd.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione' });
    }

    if (ad.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    await ad.remove();
    res.json({ message: 'Ogłoszenie zostało usunięte' });
  } catch (error) {
    console.error('Delete ad error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/tutoring/:id/favorite
// @desc    Add/remove tutoring ad to favorites
// @access  Private
router.post('/:id/favorite', auth, async (req, res) => {
  try {
    const ad = await TutoringAd.findById(req.params.id);
    
    if (!ad) {
      return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione' });
    }

    const user = await User.findById(req.user._id);
    const isFavorite = user.favorites.includes(req.params.id);

    if (isFavorite) {
      // Remove from favorites
      user.favorites = user.favorites.filter(id => id.toString() !== req.params.id);
    } else {
      // Add to favorites
      user.favorites.push(req.params.id);
    }

    await user.save();

    res.json({ 
      isFavorite: !isFavorite,
      message: !isFavorite ? 'Dodano do ulubionych' : 'Usunięto z ulubionych'
    });
  } catch (error) {
    console.error('Toggle favorite error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/tutoring/:id/apply
// @desc    Apply for a tutoring ad
// @access  Private
router.post('/:id/apply', [
  auth,
  requireRole(['student']),
  body('message').notEmpty().trim().isLength({ max: 1000 }),
  body('preferredTime').optional().trim(),
  body('preferredLocation').optional().trim()
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already applied
    const existingApplication = await TutoringAd.findOne({
      _id: req.params.id,
      'applications.student': req.user._id
    });

    if (existingApplication) {
      return res.status(400).json({ message: 'Już złożyłeś aplikację na to ogłoszenie' });
    }

    const ad = await TutoringAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione' });
    }

    const application = {
      student: req.user._id,
      message: req.body.message,
      preferredTime: req.body.preferredTime,
      preferredLocation: req.body.preferredLocation,
      status: 'pending',
      createdAt: new Date()
    };

    ad.applications.push(application);
    await ad.save();

    res.status(201).json(application);
  } catch (error) {
    console.error('Apply error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/tutoring/:id/applications
// @desc    Get applications for a tutoring ad (teacher only)
// @access  Private
router.get('/:id/applications', [auth, requireRole(['teacher'])], async (req, res) => {
  try {
    const ad = await TutoringAd.findById(req.params.id)
      .populate('applications.student', 'firstName lastName avatar email phone');

    if (!ad) {
      return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione' });
    }

    // Check if user is the teacher who created the ad
    if (ad.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    res.json({
      applications: ad.applications,
      total: ad.applications.length
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   PUT /api/tutoring/:id/applications/:applicationId
// @desc    Update application status (teacher only)
// @access  Private
router.put('/:id/applications/:applicationId', [
  auth, 
  requireRole(['teacher']),
  body('status').isIn(['accepted', 'rejected', 'pending'])
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const ad = await TutoringAd.findById(req.params.id);
    if (!ad) {
      return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione' });
    }

    // Check if user is the teacher who created the ad
    if (ad.teacher.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    const application = ad.applications.id(req.params.applicationId);
    if (!application) {
      return res.status(404).json({ message: 'Aplikacja nie została znaleziona' });
    }

    application.status = req.body.status;
    application.updatedAt = new Date();

    await ad.save();

    res.json({ 
      message: 'Status aplikacji został zaktualizowany',
      application 
    });
  } catch (error) {
    console.error('Update application error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/tutoring/:id/reviews
// @desc    Get reviews for a specific tutoring ad
// @access  Public
router.get('/:id/reviews', async (req, res) => {
  try {
    const reviews = await Review.find({ adId: req.params.id })
      .populate('student', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    res.json({
      reviews,
      total: reviews.length
    });
  } catch (error) {
    console.error('Get reviews error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/tutoring/:id/reviews
// @desc    Create a new review for a tutoring ad
// @access  Private
router.post('/:id/reviews', [
  auth,
  requireRole(['student']),
  body('rating').isInt({ min: 1, max: 5 }),
  body('comment').notEmpty().trim().isLength({ max: 500 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    // Check if user already reviewed this ad
    const existingReview = await Review.findOne({
      adId: req.params.id,
      student: req.user._id
    });

    if (existingReview) {
      return res.status(400).json({ message: 'Już oceniłeś to ogłoszenie' });
    }

    const review = new Review({
      adId: req.params.id,
      teacher: req.body.teacherId,
      student: req.user._id,
      rating: req.body.rating,
      comment: req.body.comment
    });

    await review.save();

    const populatedReview = await Review.findById(review._id)
      .populate('student', 'firstName lastName avatar');

    res.status(201).json(populatedReview);
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/tutoring/:id
// @desc    Get single tutoring ad
// @access  Public
// NOTE: This route MUST BE LAST to avoid conflicts with specific routes like /favorites, /search, etc.
router.get('/:id', async (req, res) => {
  try {
    const ad = await TutoringAd.findById(req.params.id)
      .populate('teacher', 'firstName lastName avatar rating bio phone location subjects education')
      .populate('applications.student', 'firstName lastName avatar');

    if (!ad) {
      return res.status(404).json({ message: 'Ogłoszenie nie zostało znalezione' });
    }

    // Increment views
    ad.views += 1;
    await ad.save();

    res.json(ad);
  } catch (error) {
    console.error('Get ad error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router; 