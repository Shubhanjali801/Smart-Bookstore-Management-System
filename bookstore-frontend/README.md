bookstore-frontend/
├── public/
│   ├── index.html
│   └── favicon.ico
├── src/
│   ├── api/                          ← mirrors backend routes
│   │   ├── axiosInstance.js          ← base axios + JWT interceptor
│   │   ├── authApi.js                ← mirrors authController.js
│   │   ├── bookApi.js                ← mirrors bookController.js
│   │   ├── orderApi.js               ← mirrors orderController.js
│   │   └── paymentApi.js             ← mirrors paymentController.js
│   ├── app/
│   │   └── store.js                  ← Redux store
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── Loader.jsx
│   │   │   ├── ProtectedRoute.jsx    ← mirrors authMiddleware.js
│   │   │   └── AdminRoute.jsx        ← mirrors adminMiddleware.js
│   │   ├── books/
│   │   │   ├── BookCard.jsx
│   │   │   ├── BookFilter.jsx
│   │   │   └── BookSearch.jsx
│   │   ├── cart/
│   │   │   ├── CartItem.jsx
│   │   │   └── CartSummary.jsx
│   │   ├── orders/
│   │   │   ├── OrderCard.jsx
│   │   │   └── OrderStatusBadge.jsx
│   │   └── payment/
│   │       ├── CheckoutForm.jsx      ← Stripe CardElement
│   │       └── StripeWrapper.jsx     ← loadStripe wrapper
│   ├── features/                     ← Redux slices
│   │   ├── auth/authSlice.js
│   │   ├── books/bookSlice.js
│   │   ├── cart/cartSlice.js
│   │   ├── orders/orderSlice.js
│   │   └── payment/paymentSlice.js
│   ├── pages/
│   │   ├── auth/
│   │   │   ├── LoginPage.jsx
│   │   │   └── RegisterPage.jsx
│   │   ├── books/
│   │   │   ├── BooksListPage.jsx
│   │   │   └── BookDetailPage.jsx
│   │   ├── cart/
│   │   │   └── CartPage.jsx
│   │   ├── orders/
│   │   │   ├── MyOrdersPage.jsx
│   │   │   ├── OrderDetailPage.jsx
│   │   │   └── OrderSuccessPage.jsx
│   │   ├── payment/
│   │   │   └── CheckoutPage.jsx
│   │   └── admin/
│   │       ├── AdminDashboard.jsx
│   │       ├── AdminBooksPage.jsx
│   │       └── AdminOrdersPage.jsx
│   ├── utils/
│   │   ├── formatPrice.js
│   │   └── getToken.js
│   ├── App.jsx                       ← all routes defined here
│   └── main.jsx                      ← entry point
├── .env                              ← VITE_API_URL + VITE_STRIPE_PUBLIC_KEY
├── .gitignore
├── package.json
└── vite.config.js