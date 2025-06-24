const express = require('express');
const { body, validationResult } = require('express-validator');
const Message = require('../models/Message');
const User = require('../models/User');
const { auth } = require('../middleware/auth');

const router = express.Router();

// @route   GET /api/messages/conversations
// @desc    Get user conversations
// @access  Private
router.get('/conversations', auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Get all messages where user is sender or receiver
    const messages = await Message.find({
      $or: [{ sender: userId }, { receiver: userId }]
    })
    .populate('sender', 'firstName lastName avatar')
    .populate('receiver', 'firstName lastName avatar')
    .sort({ createdAt: -1 });

    // Group messages by conversation
    const conversations = {};
    messages.forEach(message => {
      const otherUser = message.sender._id.toString() === userId.toString() 
        ? message.receiver 
        : message.sender;
      
      const conversationId = otherUser._id.toString();
      
      if (!conversations[conversationId]) {
        conversations[conversationId] = {
          user: otherUser,
          lastMessage: message,
          unreadCount: 0
        };
      }

      // Count unread messages
      if (message.receiver._id.toString() === userId.toString() && !message.isRead) {
        conversations[conversationId].unreadCount++;
      }
    });

    const conversationsList = Object.values(conversations);
    res.json(conversationsList);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/messages/:userId
// @desc    Get messages with specific user
// @access  Private
router.get('/:userId', auth, async (req, res) => {
  try {
    const { userId } = req.params;
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: userId },
        { sender: userId, receiver: currentUserId }
      ]
    })
    .populate('sender', 'firstName lastName avatar')
    .populate('receiver', 'firstName lastName avatar')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: userId, receiver: currentUserId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   POST /api/messages
// @desc    Send a message
// @access  Private
router.post('/', [
  auth,
  body('receiver').isMongoId(),
  body('content').notEmpty().trim().isLength({ max: 1000 })
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { receiver, content, tutoringAd } = req.body;
    const sender = req.user._id;

    // Check if receiver exists
    const receiverUser = await User.findById(receiver);
    if (!receiverUser) {
      return res.status(404).json({ message: 'Odbiorca nie został znaleziony' });
    }

    const message = new Message({
      sender,
      receiver,
      content,
      tutoringAd
    });

    await message.save();

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'firstName lastName avatar')
      .populate('receiver', 'firstName lastName avatar');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   PUT /api/messages/:id/read
// @desc    Mark message as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const message = await Message.findById(req.params.id);
    
    if (!message) {
      return res.status(404).json({ message: 'Wiadomość nie została znaleziona' });
    }

    if (message.receiver.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Brak uprawnień' });
    }

    message.isRead = true;
    message.readAt = new Date();
    await message.save();

    res.json(message);
  } catch (error) {
    console.error('Mark read error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

// @route   GET /api/messages/unread/count
// @desc    Get unread messages count
// @access  Private
router.get('/unread/count', auth, async (req, res) => {
  try {
    const count = await Message.countDocuments({
      receiver: req.user._id,
      isRead: false
    });

    res.json({ count });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ message: 'Błąd serwera' });
  }
});

module.exports = router; 