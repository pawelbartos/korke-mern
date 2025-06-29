const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const http = require('http');
const socketIo = require('socket.io');

// Import routes
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/users');
const tutoringRoutes = require('./routes/tutoring');
const messageRoutes = require('./routes/messages');
const reviewRoutes = require('./routes/reviews');

dotenv.config();

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: function (origin, callback) {
      // Allow requests with no origin
      if (!origin) return callback(null, true);
      
      // Allow localhost for development
      if (origin.includes('localhost')) return callback(null, true);
      
      // Allow all Vercel domains for this project
      if (origin.includes('pawels-projects-6bbbf083.vercel.app') || 
          origin.includes('client-green-phi-60.vercel.app') ||
          origin.includes('client-hru3eyc6u-pawels-projects-6bbbf083.vercel.app')) {
        return callback(null, true);
      }
      
      // Allow custom domain korke.pl
      if (origin.includes('korke.pl')) {
        return callback(null, true);
      }
      
      // Allow the specific CLIENT_URL if set
      if (origin === process.env.CLIENT_URL) {
        return callback(null, true);
      }
      
      callback(new Error('Not allowed by CORS'));
    },
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    // Allow localhost for development
    if (origin.includes('localhost')) return callback(null, true);
    
    // Allow all Vercel domains for this project
    if (origin.includes('pawels-projects-6bbbf083.vercel.app') || 
        origin.includes('client-green-phi-60.vercel.app') ||
        origin.includes('client-hru3eyc6u-pawels-projects-6bbbf083.vercel.app')) {
      return callback(null, true);
    }
    
    // Allow custom domain korke.pl
    if (origin.includes('korke.pl')) {
      return callback(null, true);
    }
    
    // Allow the specific CLIENT_URL if set
    if (origin === process.env.CLIENT_URL) {
      return callback(null, true);
    }
    
    callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

// Database connection with fallback
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/tutoring-portal', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('Connected to MongoDB');
  } catch (err) {
    console.log('MongoDB not available, running in mock mode');
    console.log('To use full functionality, please install and start MongoDB');
  }
};

connectDB();

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/tutoring', tutoringRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/reviews', reviewRoutes);

// Socket.io connection handling
io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('join_room', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  socket.on('send_message', (data) => {
    socket.to(data.roomId).emit('receive_message', data);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Client URL: ${process.env.CLIENT_URL || 'http://localhost:3000'}`);
}); 