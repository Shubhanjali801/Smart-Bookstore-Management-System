const express = require('express');
const router = express.Router();
const {
  createOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus,
} = require('../controllers/orderController');
const protect   = require('../middleware/authMiddleware');
const adminOnly = require('../middleware/adminMiddleware');

// Customer routes (protected)
router.post('/',          protect, createOrder);
router.get('/my',         protect, getMyOrders);
router.get('/:id',        protect, getOrderById);

// Admin only routes
router.get('/',                   protect, adminOnly, getAllOrders);
router.put('/:id/status',         protect, adminOnly, updateOrderStatus);

module.exports = router;