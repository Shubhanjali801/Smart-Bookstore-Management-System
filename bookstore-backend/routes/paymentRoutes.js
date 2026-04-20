
const express = require('express');
const router = express.Router();
const {
  createPaymentIntent,
  stripeWebhook,
  getPaymentByOrder,
} = require('../controllers/paymentController');
const protect = require('../middleware/authMiddleware');

router.post('/webhook',express.raw({ type: 'application/json' }),stripeWebhook);
// Protected routes
router.post('/create-intent',       protect, createPaymentIntent);
router.get('/order/:orderId',       protect, getPaymentByOrder);

module.exports = router;