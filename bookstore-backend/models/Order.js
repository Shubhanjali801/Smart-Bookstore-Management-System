const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId:          { type: mongoose.Schema.Types.ObjectId,
                     ref: 'User', required: true },
  totalPrice:      { type: Number, required: true },
  orderStatus:     { type: String,
                     enum: ['Created','Confirmed','Processing',
                            'Shipped','Delivered','Cancelled'],
                     default: 'Created' },
  paymentStatus:   { type: String,
                     enum: ['Pending','Paid','Failed'],
                     default: 'Pending' },
  shippingAddress: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);
