const express = require('express');
const router = express.Router();
const {
  getAllEmailLogs,
  getEmailLogsByUser,
} = require('../controllers/emailController');
const protect   = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Admin only routes
router.get('/',              protect, adminOnly, getAllEmailLogs);
router.get('/user/:userId',  protect, adminOnly, getEmailLogsByUser);

module.exports = router;