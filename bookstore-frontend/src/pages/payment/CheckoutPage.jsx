import { useState, useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { loadStripe } from "@stripe/stripe-js"
import {
  Elements, CardElement, useStripe, useElements
} from "@stripe/react-stripe-js"
import { createOrder } from "../../features/orders/orderSlice"
import { createPaymentIntent } from "../../features/payment/paymentSlice"
import { clearCart, selectCartTotal } from "../../features/cart/cartSlice"
import { toast } from "react-toastify"
import {
  Box, Typography, Button, TextField,
  Paper, Divider, Stack, Chip, CircularProgress,
  Step, Stepper, StepLabel
} from "@mui/material"
import {
  LocalShipping, Payment, Lock,
  ArrowBack, CheckCircle
} from "@mui/icons-material"

const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLIC_KEY)

// ── Validation ─────────────────────────────────────────────────
const schema = yup.object({
  shippingAddress: yup.string()
    .required("Shipping address is required")
    .min(10, "Please enter a complete address"),
})

// ── Card Element styling ───────────────────────────────────────
const CARD_STYLE = {
  style: {
    base: {
      fontSize: "16px",
      color: "#1a1a2e",
      fontFamily: "inherit",
      "::placeholder": { color: "#aab7c4" },
    },
    invalid: { color: "#E24B4A" },
  },
}

// ── Payment Form (inner) ───────────────────────────────────────
const PaymentForm = ({ shippingAddress }) => {
  const stripe = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items } = useSelector((state) => state.cart)
  const { createdOrder } = useSelector((state) => state.orders)
  const { clientSecret, isLoading } = useSelector((state) => state.payment)
  const [isPaying, setIsPaying] = useState(false)
  const [cardReady, setCardReady] = useState(false)

  useEffect(() => {
    if (items.length > 0 && shippingAddress) {
      const orderItems = items.map((item) => ({
        bookId: item._id,
        quantity: item.quantity,
      }))
      dispatch(createOrder({ items: orderItems, shippingAddress }))
    }
  }, [items, shippingAddress, dispatch])

  useEffect(() => {
    if (createdOrder?._id) {
      dispatch(createPaymentIntent(createdOrder._id))
    }
  }, [createdOrder, dispatch])

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return
    setIsPaying(true)
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        },
      })
      if (result.error) {
        toast.error(result.error.message)
      } else if (result.paymentIntent.status === "succeeded") {
        dispatch(clearCart())
        toast.success("Payment successful! 🎉")
        navigate("/order-success")
      }
    } catch {
      toast.error("Payment failed. Please try again.")
    } finally {
      setIsPaying(false)
    }
  }

  const isProcessing = isPaying || isLoading

  return (
    <Box component="form" onSubmit={handlePay}>

      {/* Card input box */}
      <Box sx={{
        border: "2px solid",
        borderColor: cardReady ? "primary.main" : "#e0e0e0",
        borderRadius: 2,
        p: 2.5,
        bgcolor: "#fafafa",
        transition: "border-color 0.2s",
        mb: 2,
      }}>
        <CardElement
          options={CARD_STYLE}
          onReady={() => setCardReady(true)}
        />
      </Box>

      {/* Test card hint */}
      <Box sx={{
        bgcolor: "#E8F5E9", borderRadius: 2,
        px: 2, py: 1.5, mb: 3,
        display: "flex", alignItems: "center", gap: 1,
      }}>
        <CheckCircle sx={{ color: "success.main", fontSize: 18 }} />
        <Typography variant="caption" color="success.dark" fontWeight="500">
          Test card: <strong>4242 4242 4242 4242</strong> |
          Any future date | Any 3-digit CVV
        </Typography>
      </Box>

      {/* Loading state */}
      {isLoading && !clientSecret && (
        <Box sx={{
          display: "flex", alignItems: "center",
          gap: 1, mb: 2, color: "text.secondary",
        }}>
          <CircularProgress size={16} />
          <Typography variant="caption">
            Setting up secure payment...
          </Typography>
        </Box>
      )}

      <Button
        type="submit"
        variant="contained"
        fullWidth
        size="large"
        disabled={!stripe || !clientSecret || isProcessing}
        startIcon={isProcessing
          ? <CircularProgress size={20} color="inherit" />
          : <Lock />}
        sx={{
          borderRadius: 2,
          py: 1.8,
          fontSize: "15px",
          fontWeight: 700,
          background:
            "linear-gradient(135deg, #1D9E75 0%, #27AE7F 100%)",
          "&:hover": {
            background:
              "linear-gradient(135deg, #16805E 0%, #1D9E75 100%)",
          },
          "&:disabled": { opacity: 0.6 },
        }}
      >
        {isProcessing ? "Processing Payment..." : "Pay Securely Now"}
      </Button>

      <Typography variant="caption" color="text.secondary"
        textAlign="center" display="block" mt={1.5}>
        🔒 Your payment is encrypted and secure
      </Typography>
    </Box>
  )
}

// ── Main Checkout Page ─────────────────────────────────────────
const CheckoutPage = () => {
  const { items } = useSelector((state) => state.cart)
  const total = useSelector(selectCartTotal)
  const navigate = useNavigate()
  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)

  const [activeStep, setActiveStep] = useState(0)
  const [shippingAddress, setShippingAddress] = useState("")
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    mode: "onSubmit",    // ← add this line
  })

  useEffect(() => {
    if (items.length === 0) navigate("/order-success")// navigate("/cart")
  }, [items, navigate])

  const onShippingSubmit = (data) => {
    setShippingAddress(data.shippingAddress)
    setActiveStep(1)
  }

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", width: "100%" }}>

      {/* ── Dark Header ── */}
      <Box sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        px: { xs: 2, md: 6 },
        py: 1.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Box>
          <Typography variant="h5" fontWeight="800" color="#1a1a2e">
            Checkout
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            {totalItems} items • ₹{total} total
          </Typography>
        </Box>
        <Button
          startIcon={<ArrowBack />}
          onClick={() => navigate("/order-success")} // navigate("/cart")
          variant="outlined"
          size="medium"
          sx={{ borderRadius: 2 }}
        >
          Back to Cart
        </Button>
      </Box>

      {/* ── Stepper ── */}
      <Box sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #eee",
        px: { xs: 2, md: 6 },
        py: 2,
      }}>
        <Stepper activeStep={activeStep} sx={{ maxWidth: 500 }}>
          {["Shipping Address", "Payment"].map((label, i) => (
            <Step key={label} completed={activeStep > i}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* ── Main Content ── */}
      <Box sx={{
        maxWidth: 1100,
        mx: "auto",
        px: { xs: 2, md: 4 },
        py: 4,
        display: "flex",
        gap: 3,
        flexDirection: { xs: "column", md: "row" },
        alignItems: "flex-start",
      }}>

        {/* ── LEFT: Form ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          <Paper elevation={0} sx={{
            borderRadius: 3, p: 4,
            border: "1px solid #e8e8e8",
            bgcolor: "#fff",
          }}>

            {/* ── Step 1: Shipping ── */}
            {activeStep === 0 && (
              <Box component="form"
                onSubmit={handleSubmit(onShippingSubmit)}>

                <Box sx={{
                  display: "flex", alignItems: "center",
                  gap: 1.5, mb: 3,
                }}>
                  <Box sx={{
                    bgcolor: "#EDE7F6", borderRadius: 2,
                    p: 1, display: "flex",
                  }}>
                    <LocalShipping color="primary" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="700">
                      Shipping Address
                    </Typography>
                    <Typography variant="caption"
                      color="text.secondary">
                      Where should we deliver your books?
                    </Typography>
                  </Box>
                </Box>

                <TextField
                  label="Full Delivery Address"
                  fullWidth
                  multiline
                  rows={5}
                  {...register("shippingAddress")}
                  error={!!errors.shippingAddress}
                  helperText={errors.shippingAddress?.message ||
                    "Include house no, street, city, state and PIN code"}
                  placeholder={
                    "Example:\n" +
                    "12 MG Road, Sector 4\n" +
                    "Lucknow, Uttar Pradesh\n" +
                    "PIN: 226001"
                  }
                  sx={{
                    mb: 3,
                    "& .MuiOutlinedInput-root": { borderRadius: 2 },
                  }}
                />

                {/* Saved addresses hint */}
                <Box sx={{
                  bgcolor: "#F3F0FF", borderRadius: 2,
                  px: 2, py: 1.5, mb: 3,
                  display: "flex", gap: 1, alignItems: "flex-start",
                }}>
                  <Typography variant="caption" color="primary.main">
                    💡 Make sure your address is complete and correct.
                    Our delivery partner will use this address to ship your
                    books.
                  </Typography>
                </Box>

                <Button
                  type="submit"
                  variant="contained"
                  fullWidth
                  size="large"
                  sx={{
                    borderRadius: 2, py: 1.8,
                    fontSize: "15px", fontWeight: 700,
                    background:
                      "linear-gradient(135deg, #534AB7 0%, #7B75D0 100%)",
                  }}
                >
                  Continue to Payment →
                </Button>
              </Box>
            )}

            {/* ── Step 2: Payment ── */}
            {activeStep === 1 && (
              <Box>
                <Box sx={{
                  display: "flex", alignItems: "center",
                  gap: 1.5, mb: 3,
                }}>
                  <Box sx={{
                    bgcolor: "#E8F5E9", borderRadius: 2,
                    p: 1, display: "flex",
                  }}>
                    <Payment color="success" />
                  </Box>
                  <Box>
                    <Typography variant="h6" fontWeight="700">
                      Payment Details
                    </Typography>
                    <Typography variant="caption"
                      color="text.secondary">
                      Complete your purchase securely
                    </Typography>
                  </Box>
                </Box>

                {/* Shipping address preview */}
                <Box sx={{
                  bgcolor: "#f5f5f5",
                  borderRadius: 2, px: 2, py: 1.5,
                  mb: 3, display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                  <Box>
                    <Typography variant="caption"
                      color="text.secondary" fontWeight="600">
                      DELIVERING TO
                    </Typography>
                    <Typography variant="body2" color="#1a1a2e"
                      fontWeight="500">
                      📍 {shippingAddress}
                    </Typography>
                  </Box>
                  <Button size="medium"
                    onClick={() => setActiveStep(0)}
                    sx={{ fontSize: "12px", borderRadius: 2 }}>
                    Change
                  </Button>
                </Box>

                <Elements stripe={stripePromise}>
                  <PaymentForm shippingAddress={shippingAddress} />
                </Elements>

              </Box>
            )}
          </Paper>
        </Box>

        {/* ── RIGHT: Order Summary ── */}
        <Box sx={{
          width: { xs: "100%", md: 340 },
          flexShrink: 0,
          position: { md: "sticky" },
          top: 90,
        }}>
          <Paper elevation={0} sx={{
            borderRadius: 3,
            overflow: "hidden",
            border: "1px solid #e8e8e8",
          }}>

            {/* Summary header */}
            <Box sx={{
              bgcolor: "#1a1a2e", px: 3, py: 2.5,
            }}>
              <Typography variant="h6" fontWeight="bold" color="#fff">
                Order Summary
              </Typography>
              <Typography variant="caption"
                sx={{ color: "#9FE1CB" }}>
                {totalItems} items
              </Typography>
            </Box>

            <Box sx={{ p: 3 }}>

              {/* Items */}
              <Stack spacing={2} mb={2}>
                {items.map((item) => (
                  <Box key={item._id} sx={{
                    display: "flex",
                    gap: 1.5,
                    alignItems: "center",
                  }}>
                    <Box
                      component="img"
                      src={item.imageUrl ||
                        "https://via.placeholder.com/40x55"}
                      alt={item.title}
                      sx={{
                        width: 40, height: 55,
                        objectFit: "cover",
                        borderRadius: 1,
                        flexShrink: 0,
                        boxShadow: 1,
                      }}
                    />
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="body2"
                        fontWeight="600" noWrap>
                        {item.title}
                      </Typography>
                      <Typography variant="caption"
                        color="text.secondary">
                        ₹{item.price} × {item.quantity}
                      </Typography>
                    </Box>
                    <Typography variant="body2" fontWeight="700">
                      ₹{item.price * item.quantity}
                    </Typography>
                  </Box>
                ))}
              </Stack>

              <Divider sx={{ mb: 2 }} />

              {/* Charges */}
              <Box sx={{
                display: "flex", justifyContent: "space-between",
                mb: 1,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Subtotal
                </Typography>
                <Typography variant="body2" fontWeight="600">
                  ₹{total}
                </Typography>
              </Box>
              <Box sx={{
                display: "flex", justifyContent: "space-between",
                mb: 2,
              }}>
                <Typography variant="body2" color="text.secondary">
                  Delivery
                </Typography>
                <Chip label="FREE" size="medium" color="success"
                  sx={{
                    height: 20, fontSize: "11px",
                    fontWeight: 700
                  }} />
              </Box>

              <Divider sx={{ mb: 2 }} />

              {/* Total */}
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                mb: 2,
              }}>
                <Box>
                  <Typography fontWeight="800" variant="h6">
                    Total
                  </Typography>
                  <Typography variant="caption"
                    color="text.secondary">
                    Incl. of all taxes
                  </Typography>
                </Box>
                <Typography variant="h4" fontWeight="800"
                  color="success.main">
                  ₹{total}
                </Typography>
              </Box>

              {/* Step indicator */}
              <Box sx={{
                bgcolor: activeStep === 1 ? "#E8F5E9" : "#F3F0FF",
                borderRadius: 2, px: 2, py: 1.5,
                textAlign: "center",
              }}>
                <Typography variant="caption"
                  color={activeStep === 1
                    ? "success.main" : "primary.main"}
                  fontWeight="600">
                  {activeStep === 0
                    ? "📍 Step 1: Enter shipping address"
                    : "💳 Step 2: Complete payment"}
                </Typography>
              </Box>
              
            </Box>
          </Paper>

          {/* Payment methods */}
          <Paper elevation={0} sx={{
            mt: 2, p: 2, borderRadius: 3,
            border: "1px solid #e8e8e8",
            textAlign: "center",
          }}>
            <Typography variant="caption"
              color="text.secondary" display="block" mb={1}>
              Accepted payment methods
            </Typography>
            <Stack direction="row" spacing={1} justifyContent="center">
              {["💳 Visa", "💳 Mastercard", "💳 RuPay", "🏦 UPI"]
                .map((p) => (
                  <Chip key={p} label={p} size="medium"
                    variant="outlined"
                    sx={{ fontSize: "11px" }} />
                ))}
            </Stack>
          </Paper>
        </Box>
      </Box>
    </Box>
  )
}

export default CheckoutPage