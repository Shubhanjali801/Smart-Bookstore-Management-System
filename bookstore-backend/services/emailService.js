const transporter = require('../config/email');
const EmailLog = require('../models/EmailLog');

const sendOrderConfirmation = async (userEmail, order, userId) => {
  try {
    // Send email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: 'Order Confirmed - Bookstore',
      html: `
        <h2>Order Confirmed!</h2>
        <p>Order ID: ${order._id}</p>
        <p>Total: ₹${order.totalPrice}</p>
        <p>Status: ${order.orderStatus}</p>
        <p>Shipping to: ${order.shippingAddress}</p>
        <br/>
        <p>Thank you for shopping with Bookstore!</p>
      `,
    });

    console.log(`Email sent successfully to: ${userEmail}`);

    // Log to MongoDB — always save log after sending
    await EmailLog.create({
      userId,
      emailType: 'Order Confirmation',
      recipientEmail: userEmail,
      status: 'Sent',
      sentAt: new Date(),
    });

    console.log(`Email logged: [Order Confirmation] → ${userEmail} | Status: Sent`);

  } catch (error) {
    console.error('Email sending failed:', error.message);

    // Save failed log even if email sending fails
    await EmailLog.create({
      userId,
      emailType: 'Order Confirmation',
      recipientEmail: userEmail,
      status: 'Failed',
      sentAt: new Date(),
    }).catch((logError) =>
      console.error('Email log saving failed:', logError.message)
    );
  }
};

module.exports = { sendOrderConfirmation };