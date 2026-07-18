const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db');
const errorHandler = require('./middleware/errorMiddleware');

dotenv.config();
connectDB();

const app = express();

// ── MIDDLEWARE ──

// Explicitly allowed origins (trailing slashes stripped so the browser's
// slash-less Origin still matches). CLIENT_URL lets you pin a prod origin too.
const allowedOrigins = [
  'http://localhost:5173',
  'https://bookstore-frontends.vercel.app',
  process.env.CLIENT_URL,
]
  .filter(Boolean)
  .map((o) => o.replace(/\/+$/, ''));

// Any Vercel deployment of this project is allowed. Vercel hands out several
// hostnames (production, git-branch, and per-commit preview URLs), so matching
// the *.vercel.app suffix avoids re-breaking CORS every time the URL changes.
const isAllowedOrigin = (origin) => {
  const normalized = origin.replace(/\/+$/, '');
  if (allowedOrigins.includes(normalized)) return true;
  return /^https:\/\/[a-z0-9-]+\.vercel\.app$/i.test(normalized);
};

app.use(cors({
  origin(origin, callback) {
    // Non-browser requests (curl, health checks, server-to-server) send no Origin.
    if (!origin) return callback(null, true);
    if (isAllowedOrigin(origin)) return callback(null, true);
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