import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"

// ── Async Actions ──────────────────────────────────────────────

// Create payment intent
export const createPaymentIntent = createAsyncThunk(
  "payment/createIntent",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/payment/create-intent", { orderId })
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create payment"
      )
    }
  }
)

// Fetch payment by order
export const fetchPaymentByOrder = createAsyncThunk(
  "payment/fetchByOrder",
  async (orderId, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/payment/order/${orderId}`)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch payment"
      )
    }
  }
)

// ── Initial State ──────────────────────────────────────────────

const initialState = {
  clientSecret: null,
  paymentIntentId: null,
  payment: null,
  isLoading: false,
  error: null,
}

// ── Slice ──────────────────────────────────────────────────────

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    clearPayment: (state) => {
      state.clientSecret = null
      state.paymentIntentId = null
      state.payment = null
    },
    clearPaymentError: (state) => {
      state.error = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create payment intent
      .addCase(createPaymentIntent.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createPaymentIntent.fulfilled, (state, action) => {
        state.isLoading = false
        state.clientSecret = action.payload.clientSecret
        state.paymentIntentId = action.payload.paymentIntentId
      })
      .addCase(createPaymentIntent.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Fetch payment by order
      .addCase(fetchPaymentByOrder.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchPaymentByOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.payment = action.payload
      })
      .addCase(fetchPaymentByOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })
  },
})

export const { clearPayment, clearPaymentError } = paymentSlice.actions
export default paymentSlice.reducer