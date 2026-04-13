
const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  stripeWebhook,
  getPaymentByOrder,
} = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

// IMPORTANT: Stripe webhook needs raw body — must be defined BEFORE express.json()
// This route is registered separately in server.js with express.raw()
router.post('/webhook',express.raw({ type: 'application/json' }),stripeWebhook);
// Protected routes
router.post('/create-intent',       protect, createPaymentIntent);
router.get('/order/:orderId',       protect, getPaymentByOrder);

module.exports = router;