const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// ── MIDDLEWARE ──

app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3000',
    'https://bookstorefrontend-m2vv.vercel.app/', // ← add after Vercel deploy
    '*' // ← temporarily allow all during testing
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}))


// IMPORTANT: Stripe webhook needs raw body BEFORE express.json()
app.use('/api/payment/webhook',
  express.raw({ type: 'application/json' }),
  require('./routes/paymentRoutes')
);

// JSON body parser for all other routes
app.use(express.json());

// ── ROUTES ──
app.use('/api/auth',     require('./routes/authRoutes'));
app.use('/api/books',    require('./routes/bookRoutes'));
app.use('/api/orders',   require('./routes/orderRoutes'));
app.use('/api/payment',  require('./routes/paymentRoutes'));
app.use('/api/emails',   require('./routes/emailRoutes'));

// ── HEALTH CHECK ──
app.get('/', (req, res) => {
  res.json({ message: 'Bookstore API is running' });
});

// ── ERROR HANDLER (must be last) ──
app.use(errorHandler);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT} in ${process.env.NODE_ENV} mode`);
});