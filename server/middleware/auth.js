const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ message: 'Brak tokenu autoryzacji' });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Get user from MongoDB Atlas
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json({ message: 'Użytkownik nie został znaleziony' });
    }

    if (!user.isActive) {
      return res.status(401).json({ message: 'Konto zostało dezaktywowane' });
    }

    req.user = user;
    req.token = token;
    next();
  } catch (error) {
    res.status(401).json({ message: 'Nieprawidłowy token' });
  }
};

const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ message: 'Brak autoryzacji' });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    next();
  };
};

module.exports = { auth, requireRole }; 