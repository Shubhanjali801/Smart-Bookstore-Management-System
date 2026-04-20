# 📚 Smart Bookstore Management System

A full-stack **MERN** (MongoDB, Express.js, React.js, Node.js) e-commerce bookstore with Stripe payment integration, automated email notifications, and a comprehensive admin dashboard.

---

## 🌐 Live Demo

| Service | URL |
|---|---|
| 🖥️ Frontend | [bookstorefrontend-m2vv.vercel.app](https://bookstorefrontend-m2vv.vercel.app) |
| ⚙️ Backend API | [bookstore-backend-l20s.onrender.com](https://bookstore-backend-l20s.onrender.com) |

<!-- > ⚠️ Backend is hosted on Render free tier — first request may take 30–60 seconds to wake up. -->

---

## ✨ Features

### Customer
- 🔐 Register & Login with JWT authentication
- 📖 Browse books with genre filter, search, and pagination
- 🛒 Shopping cart with quantity management (Redux state)
- 💳 Stripe payment gateway with test card support
- 📦 Order tracking with real-time status updates
- 📧 Automated order confirmation email on payment

### Admin
- 📊 Dashboard with stats — total books, orders, revenue, low stock
- 📝 Full book inventory CRUD (Add / Edit / Delete)
- 🔄 Order management with status update dropdown
- 📋 Email log monitoring (Sent / Failed audit trail)

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Frontend** | React.js 18, Vite, Material-UI v5, Redux Toolkit |
| **Backend** | Node.js, Express.js, MVC Architecture |
| **Database** | MongoDB Atlas, Mongoose ODM |
| **Auth** | JWT, bcrypt |
| **Payment** | Stripe PaymentIntent API + Webhook |
| **Email** | Nodemailer + Gmail SMTP |
| **Deployment** | Vercel (frontend), Render (backend) |
| **Forms** | React Hook Form + Yup validation |

---

## 📁 Project Structure

```
Smart-Bookstore-Management-System/
│
├── bookstore-backend/
│   ├── config/           # db.js, stripe.js, email.js
│   ├── controllers/      # auth, book, order, payment, email
│   ├── middleware/       # authMiddleware, adminMiddleware, errorMiddleware
│   ├── models/           # User, Book, Order, OrderItem, Payment, EmailLog
│   ├── routes/           # 5 route files
│   ├── services/         # emailService.js, stripeService.js
│   ├── utils/            # generateToken.js, validators.js
│   └── server.js
│
└── bookstore-frontend/
    ├── src/
    │   ├── api/          # axiosInstance + 5 API files
    │   ├── app/          # Redux store
    │   ├── components/   # Navbar, BookCard, BookFilter, BookSearch, etc.
    │   ├── features/     # 5 Redux slices
    │   ├── pages/        # 12 pages (customer + admin)
    │   └── utils/
    ├── vercel.json
    └── vite.config.js
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js v18+
- MongoDB Atlas account
- Stripe account (test mode)
- Gmail account with App Password

---

### 1. Clone the Repository

```bash
git clone https://github.com/Shubhanjali801/Smart-Bookstore-Management-System.git
cd Smart-Bookstore-Management-System
```

---

### 2. Backend Setup

```bash
cd bookstore-backend
npm install
```

Create a `.env` file in `bookstore-backend/`:

```env
MONGO_URI=mongodb+srv://your_username:your_password@cluster.mongodb.net/bookstore
JWT_SECRET=your_jwt_secret_key
STRIPE_SECRET_KEY=sk_test_51XXXXXXXXXX
STRIPE_WEBHOOK_SECRET=whsec_XXXXXXXXXX
EMAIL_USER=youremail@gmail.com
EMAIL_PASS=xxxx xxxx xxxx xxxx
NODE_ENV=development
PORT=5000
```

> 📌 Gmail `EMAIL_PASS` must be a **16-character App Password** — not your regular Gmail password.
> Generate it at: Google Account → Security → 2-Step Verification → App Passwords

Start backend:
```bash
npm run dev
```

Backend runs at: `http://localhost:5000`

---

### 3. Frontend Setup

```bash
cd bookstore-frontend
npm install
```

Create a `.env.local` file in `bookstore-frontend/`:

```env
VITE_API_URL=http://localhost:5000
VITE_STRIPE_PUBLIC_KEY=pk_test_51XXXXXXXXXX
```

Start frontend:
```bash
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### 4. Stripe Webhook (Local Testing)

Install Stripe CLI and run:
```bash
stripe listen --forward-to localhost:5000/api/payment/webhook
```

Copy the `whsec_` secret shown in terminal → paste it in your `.env` as `STRIPE_WEBHOOK_SECRET`.

---

## 💳 Test Payment

Use this Stripe test card at checkout:

```
Card Number  →  4242 4242 4242 4242
Expiry       →  12/29  (any future date)
CVV          →  123    (any 3 digits)
```

---

## 📡 API Endpoints

| Method | Endpoint | Access | Description |
|---|---|---|---|
| POST | `/api/auth/register` | Public | Register new user |
| POST | `/api/auth/login` | Public | Login, returns JWT |
| GET | `/api/auth/profile` | Private | Get own profile |
| GET | `/api/books` | Public | List books (search/filter) |
| POST | `/api/books` | Admin | Create book |
| PUT | `/api/books/:id` | Admin | Update book |
| DELETE | `/api/books/:id` | Admin | Delete book |
| POST | `/api/orders` | Private | Place order |
| GET | `/api/orders/my` | Private | Get own orders |
| GET | `/api/orders` | Admin | Get all orders |
| PUT | `/api/orders/:id/status` | Admin | Update order status |
| POST | `/api/payment/create-intent` | Private | Create Stripe PaymentIntent |
| POST | `/api/payment/webhook` | Public | Stripe webhook handler |
| GET | `/api/emails` | Admin | Get email logs |

---

## 👤 Admin Setup

The `role` field defaults to `customer` on registration. To make a user admin:

1. Open **MongoDB Atlas** → Browse Collections → Users
2. Find the user → Edit → Change `role` from `"customer"` to `"admin"`
3. Save → Login again

---

## ☁️ Deployment

### Backend → Render

| Setting | Value |
|---|---|
| Build Command | `npm install` |
| Start Command | `node server.js` |
| Region | Singapore |
| Auto-deploy | On push to `main` |

Add all `.env` variables in Render → Environment tab.

### Frontend → Vercel

| Setting | Value |
|---|---|
| Framework | Vite |
| Build Command | `npm run build` |
| Output Directory | `dist` |
| Root Directory | `bookstore-frontend` |

Add `VITE_API_URL` and `VITE_STRIPE_PUBLIC_KEY` in Vercel → Settings → Environment Variables.

> After adding env variables on Vercel — **always redeploy** for changes to take effect.

---

## 🔄 CI/CD

Every push to `main` branch triggers automatic redeploy on both **Vercel** and **Render**.

```bash
# Update backend
cd bookstore-backend
git add .
git commit -m "your message"
git push   # → Render auto-redeploys

# Update frontend
cd bookstore-frontend
git add .
git commit -m "your message"
git push   # → Vercel auto-redeploys
```

---

## 📸 Screenshots

| Browse Books | Admin Dashboard |
|---|---|
| Genre filter + search + grid | Stats + orders + revenue |

| Checkout | Admin Books |
|---|---|
| 2-step: address + Stripe | Full CRUD + stock chips |

---

## 📄 License

This project was developed as part of the **Month 2 internship assignment** at [The Skybrisk](https://theskybrisk.com).

---

## 👩‍💻 Author

**Shubhanjali**
B.Tech Information Technology — IIIT Allahabad
[GitHub](https://github.com/Shubhanjali801)

---

<div align="center">
  Made with ❤️ using MongoDB · Express.js · React.js · Node.js
</div>
