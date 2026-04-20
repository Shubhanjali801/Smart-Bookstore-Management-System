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

const sendOrderStatusUpdate = async (userEmail, orderStatus, orderId, userId) => {
  const statusMessages = {
    Confirmed:  { subject: "Order Confirmed ✅", emoji: "✅", msg: "Your order has been confirmed and is being prepared." },
    Processing: { subject: "Order Being Processed 📦", emoji: "📦", msg: "Your order is currently being packed." },
    Shipped:    { subject: "Order Shipped 🚚", emoji: "🚚", msg: "Your order is on its way!" },
    Delivered:  { subject: "Order Delivered 🎉", emoji: "🎉", msg: "Your order has been delivered. Enjoy your books!" },
    Cancelled:  { subject: "Order Cancelled ❌", emoji: "❌", msg: "Your order has been cancelled." },
  }

  const info = statusMessages[orderStatus]
  if (!info) return  // ← no email for "Created" status

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: userEmail,
      subject: `Bookstore — ${info.subject}`,
      html: `
        <div style="font-family:Arial,sans-serif;max-width:500px;
          margin:auto;padding:24px;border:1px solid #eee;border-radius:8px;">
          <h2 style="color:#1a1a2e;">${info.emoji} Order Status Update</h2>
          <p style="font-size:16px;color:#333;">${info.msg}</p>
          <div style="background:#f5f5f5;padding:16px;border-radius:8px;margin:16px 0;">
            <p style="margin:0;font-size:13px;color:#666;">Order ID</p>
            <p style="margin:4px 0;font-weight:bold;font-family:monospace;color:#1a1a2e;">
              #${orderId.toString().slice(-8).toUpperCase()}
            </p>
            <p style="margin:8px 0 0;font-size:13px;color:#666;">New Status</p>
            <p style="margin:4px 0;font-weight:bold;color:#534AB7;">
              ${orderStatus}
            </p>
          </div>
          <p style="color:#888;font-size:12px;">Thank you for shopping with Bookstore! 📚</p>
        </div>
      `,
    })

    await EmailLog.create({
      userId,
      emailType: `Status Update — ${orderStatus}`,
      recipientEmail: userEmail,
      status: "Sent",
    })

    console.log(`✅ Status email sent: ${orderStatus} → ${userEmail}`)
  } catch (error) {
    await EmailLog.create({
      userId,
      emailType: `Status Update — ${orderStatus}`,
      recipientEmail: userEmail,
      status: "Failed",
    })
    console.error("❌ Status email failed:", error.message)
  }
}

// ← add to exports at bottom
module.exports = { sendOrderConfirmation, sendOrderStatusUpdate }