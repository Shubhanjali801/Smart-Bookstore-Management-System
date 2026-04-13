const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
  userId:         { type: mongoose.Schema.Types.ObjectId,
                    ref: 'User' },
  emailType:      { type: String }, // 'Order Confirmation', etc.
  recipientEmail: { type: String, required: true },
  status:         { type: String,
                    enum: ['Sent','Failed'], default: 'Sent' },
  sentAt:         { type: Date, default: Date.now },
});

module.exports = mongoose.model('EmailLog', emailLogSchema);
