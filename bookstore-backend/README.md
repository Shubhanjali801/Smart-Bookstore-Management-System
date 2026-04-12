BookStore backend

```
bookstore-backend/
├── config/
│   ├── db.js              ← MongoDB connection
│   ├── stripe.js          ← Stripe SDK init
│   └── email.js           ← Nodemailer transporter
├── controllers/
│   ├── authController.js  ← register, login
│   ├── bookController.js  ← CRUD + search/filter
│   ├── orderController.js ← create, get, update status
│   ├── paymentController.js ← PaymentIntent + webhook
│   └── emailController.js ← log email to DB
├── middleware/
│   ├── authMiddleware.js  ← verify JWT → req.user
│   ├── adminMiddleware.js ← role === 'admin' check
│   └── errorMiddleware.js ← centralized error handler
├── models/
│   ├── User.js            ← name, email, role, phone, address
│   ├── Book.js            ← title, price, stock, isbn
│   ├── Order.js           ← userId, status, shippingAddress
│   ├── OrderItem.js       ← orderId, bookId, qty, price
│   ├── Payment.js         ← paymentIntentId, amount, status
│   └── EmailLog.js        ← emailType, recipient, status
├── routes/
│   ├── authRoutes.js      ← POST /api/auth/register, /login
│   ├── bookRoutes.js      ← GET/POST/PUT/DELETE /api/books
│   ├── orderRoutes.js     ← /api/orders (protected)
│   └── paymentRoutes.js   ← /api/payment + /webhook
├── services/
│   ├── stripeService.js   ← createPaymentIntent helper
│   └── emailService.js    ← sendOrderConfirmation + log
├── utils/
│   ├── generateToken.js   ← JWT sign with 30d expiry
│   └── validators.js      ← email, password, ObjectId checks
├── .env                   ← secrets (never commit)
├── .env.example           ← safe template for team
├── .gitignore
├── package.json
└── server.js              ← entry point

```