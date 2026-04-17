import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js"
import { createOrder } from "../../features/orders/orderSlice"
import { createPaymentIntent } from "../../features/payment/paymentSlice"
import { clearCart } from "../../features/cart/cartSlice"
import { toast } from "react-toastify"
import {
  Box, Typography, Button, TextField,
  CircularProgress, Step, Stepper,
  StepLabel
} from "@mui/material"
import { Payment, LocalShipping } from "@mui/icons-material"

const schema = yup.object({
  shippingAddress: yup.string()
    .required("Shipping address is required")
    .min(10, "Please enter a complete address"),
})

const steps = ["Shipping Address", "Payment"]

const CheckoutForm = () => {
  const stripe   = useStripe()
  const elements = useElements()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const { items }        = useSelector((state) => state.cart)
  const { createdOrder } = useSelector((state) => state.orders)
  const { clientSecret, isLoading } = useSelector((state) => state.payment)

  const [activeStep,       setActiveStep]       = useState(0)
  const [shippingAddress,  setShippingAddress]  = useState("")
  const [isPaying,         setIsPaying]         = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

// Step 1 — Create order when shipping address is confirmed
useEffect(() => {
  if (activeStep === 1 && items.length > 0 && shippingAddress) {
    const orderItems = items.map((item) => ({
      bookId: item._id,
      quantity: item.quantity,
    }))
    dispatch(createOrder({ items: orderItems, shippingAddress }))
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [activeStep])

// Step 2 — Create payment intent once order is created
useEffect(() => {
  if (createdOrder?._id) {
    dispatch(createPaymentIntent(createdOrder._id))
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, [createdOrder])

  const onShippingSubmit = (data) => {
    setShippingAddress(data.shippingAddress)
    setActiveStep(1)
  }

  const handlePay = async (e) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    setIsPaying(true)
    try {
      const result = await stripe.confirmCardPayment(clientSecret, {
        payment_method: { card: elements.getElement(CardElement) },
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

  return (
    <Box>
      <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
        {steps.map((label) => (
          <Step key={label}><StepLabel>{label}</StepLabel></Step>
        ))}
      </Stepper>

      {/* Step 1 — Shipping */}
      {activeStep === 0 && (
        <Box component="form" onSubmit={handleSubmit(onShippingSubmit)}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <LocalShipping color="primary" />
            <Typography variant="h6" fontWeight="bold">Shipping Address</Typography>
          </Box>

          <TextField
            label="Full Delivery Address"
            fullWidth
            multiline
            rows={4}
            {...register("shippingAddress")}
            error={!!errors.shippingAddress}
            helperText={errors.shippingAddress?.message}
            placeholder="House no, Street, City, State, PIN code"
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            size="large"
            sx={{ mt: 3, borderRadius: 2, py: 1.5 }}
          >
            Continue to Payment →
          </Button>
        </Box>
      )}

      {/* Step 2 — Payment */}
      {activeStep === 1 && (
        <Box component="form" onSubmit={handlePay}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <Payment color="primary" />
            <Typography variant="h6" fontWeight="bold">Payment Details</Typography>
          </Box>

          <Box sx={{ background: "#f5f5f5", borderRadius: 2, p: 2, mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              📍 {shippingAddress}
            </Typography>
          </Box>

          <Typography variant="body2" color="text.secondary" mb={2}>
            Enter your card details
          </Typography>

          <Box sx={{ border: "1px solid #ddd", borderRadius: 2,
            p: 2, mb: 2, backgroundColor: "#fafafa" }}>
            <CardElement options={{ style: { base: { fontSize: "16px" } } }} />
          </Box>

          <Typography variant="caption" color="text.secondary"
            display="block" textAlign="center" mb={2}>
            Test card: 4242 4242 4242 4242 | Any future date | Any CVV
          </Typography>

          <Button
            type="submit"
            variant="contained"
            color="success"
            fullWidth
            size="large"
            disabled={!stripe || !clientSecret || isPaying || isLoading}
            startIcon={isPaying || isLoading
              ? <CircularProgress size={20} color="inherit" />
              : <Payment />}
            sx={{ borderRadius: 2, py: 1.5 }}
          >
            {isPaying || isLoading ? "Processing..." : "Pay Now"}
          </Button>

          <Button onClick={() => setActiveStep(0)} sx={{ mt: 2 }} size="medium">
            ← Back to Shipping
          </Button>
        </Box>
      )}
    </Box>
  )
}

export default CheckoutForm
