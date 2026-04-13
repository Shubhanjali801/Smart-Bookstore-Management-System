const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
  orderId:  { type: mongoose.Schema.Types.ObjectId,
              ref: 'Order', required: true },
  bookId:   { type: mongoose.Schema.Types.ObjectId,
              ref: 'Book', required: true },
  quantity: { type: Number, required: true, min: 1 },
  price:    { type: Number, required: true },
});

module.exports = mongoose.model('OrderItem', orderItemSchema);
