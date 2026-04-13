const stripe = require('../config/stripe');
const Payment = require('../models/Payment');
const Order = require('../models/Order');
const { sendOrderConfirmation } = require('../services/emailService');

// @desc    Create Stripe PaymentIntent
// @route   POST /api/payment/create-intent
// @access  Private
exports.createPaymentIntent = async (req, res) => {
  try {
    const { orderId } = req.body;
    console.log('Received orderId:', orderId);        // ← add this
    console.log('Logged in user:', req.user._id);     // ← add this
    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Only the order owner can pay
    if (order.userId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to pay for this order' });
    }

    // Prevent re-payment
    if (order.paymentStatus === 'Paid') {
      return res.status(400).json({ message: 'Order is already paid' });
    }

    // Create PaymentIntent with Stripe
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // convert to paise/cents
      currency: 'inr',
      metadata: {
        orderId: order._id.toString(),
        userId: req.user._id.toString(),
      },
    });

    // Save payment record in DB
    await Payment.create({
      orderId: order._id,
      paymentIntentId: paymentIntent.id,
      amount: order.totalPrice,
      currency: 'inr',
      status: 'Pending',
    });

    res.status(200).json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
    });
  } catch (error) {
    console.error('Error in createPaymentIntent controller:', error.message);
    res.status(500).json({ message: 'Server error creating payment intent' });
  }
};

// @desc    Stripe Webhook — confirm payment success
// @route   POST /api/payment/webhook
// @access  Public (Stripe only) — raw body required
exports.stripeWebhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  let event;

  try {
    event = stripe.webhooks.constructEvent(
      req.body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error) {
    console.error('Webhook signature verification failed:', error.message);
    return res.status(400).json({ message: `Webhook error: ${error.message}` });
  }

  try {
    if (event.type === 'payment_intent.succeeded') {
      const paymentIntent = event.data.object;
      const { orderId, userId } = paymentIntent.metadata;

      // Update Payment record
      await Payment.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'Succeeded', transactionDate: new Date() }
      );

      // Update Order status
      const order = await Order.findByIdAndUpdate(
        orderId,
        { paymentStatus: 'Paid', orderStatus: 'Confirmed' },
        {
          returnDocument: 'after' 
        }
        // { new: true }
      );

      // Send confirmation email
      if (order) {
        const User = require('../models/User');
        const user = await User.findById(userId);
        if (user) {
          sendOrderConfirmation(user.email, order, userId).catch((err) =>
            console.error('Confirmation email failed:', err.message)
          );
        }
      }
    }

    if (event.type === 'payment_intent.payment_failed') {
      const paymentIntent = event.data.object;

      await Payment.findOneAndUpdate(
        { paymentIntentId: paymentIntent.id },
        { status: 'Failed' }
      );

      await Order.findByIdAndUpdate(
        paymentIntent.metadata.orderId,
        { paymentStatus: 'Failed' }
      );
    }

    res.status(200).json({ received: true });
  } catch (error) {
    console.error('Error processing webhook event:', error.message);
    res.status(500).json({ message: 'Webhook processing error' });
  }
};

// @desc    Get payment details by order ID
// @route   GET /api/payment/:orderId
// @access  Private
exports.getPaymentByOrder = async (req, res) => {
  try {
    const payment = await Payment.findOne({ orderId: req.params.orderId });
    if (!payment) {
      return res.status(404).json({ message: 'Payment not found for this order' });
    }
    res.status(200).json(payment);
  } catch (error) {
    console.error('Error in getPaymentByOrder controller:', error.message);
    res.status(500).json({ message: 'Server error fetching payment' });
  }
};