const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// ── MIDDLEWARE ──

// Allowed origins. Trailing slashes are stripped so an exact-match never
// fails just because the browser sends the Origin without one. Add the prod
// frontend here (or via the CLIENT_URL env var) whenever it changes.
const allowedOrigins = [
  'http://localhost:5173',
  'https://bookstore-frontend-new.vercel.app',
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((o) => o.replace(/\/+$/, ''));

app.use(cors({
  origin(origin, callback) {
    // Non-browser requests (curl, health checks, server-to-server) send no Origin.
    if (!origin) return callback(null, true);
    const normalized = origin.replace(/\/+$/, '');
    if (allowedOrigins.includes(normalized)) return callback(null, true);
    return callback(new Error(`Not allowed by CORS: ${origin}`));
  },
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