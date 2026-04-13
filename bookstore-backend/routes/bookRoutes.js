const express = require('express');
const router = express.Router();
const {
  getAllBooks,
  getBookById,
  createBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');
const protect   = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Public routes
router.get('/',     getAllBooks);
router.get('/:id',  getBookById);

// Admin only routes
router.post('/',      protect, adminOnly, createBook);
router.put('/:id',    protect, adminOnly, updateBook);
router.delete('/:id', protect, adminOnly, deleteBook);

module.exports = router;