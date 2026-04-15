import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"

// ── Async Actions ──────────────────────────────────────────────

// Create order
export const createOrder = createAsyncThunk(
  "orders/create",
  async (orderData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/orders", orderData)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create order"
      )
    }
  }
)

// Fetch my orders (customer)
export const fetchMyOrders = createAsyncThunk(
  "orders/fetchMy",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/orders/my")
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch orders"
      )
    }
  }
)

// Fetch order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/orders/${id}`)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch order"
      )
    }
  }
)

// Fetch all orders (admin)
export const fetchAllOrders = createAsyncThunk(
  "orders/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/orders", { params })
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch all orders"
      )
    }
  }
)

// Update order status (admin)
export const updateOrderStatus = createAsyncThunk(
  "orders/updateStatus",
  async ({ id, orderStatus }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/api/orders/${id}/status`, { orderStatus })
      return res.data.order
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update status"
      )
    }
  }
)

// ── Initial State ──────────────────────────────────────────────

const initialState = {
  orders: [],
  order: null,
  createdOrder: null,
  total: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  error: null,
}

// ── Slice ──────────────────────────────────────────────────────

const orderSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearOrderError: (state) => {
      state.error = null
    },
    clearCreatedOrder: (state) => {
      state.createdOrder = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Create order
      .addCase(createOrder.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.isLoading = false
        state.createdOrder = action.payload.order
        toast.success("Order placed successfully!")
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Fetch my orders
      .addCase(fetchMyOrders.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchMyOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload
      })
      .addCase(fetchMyOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Fetch order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false
        state.order = action.payload
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Fetch all orders (admin)
      .addCase(fetchAllOrders.pending, (state) => {
        state.isLoading = true
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = action.payload.orders
        state.total = action.payload.total
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Update order status
      .addCase(updateOrderStatus.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        state.isLoading = false
        state.orders = state.orders.map((o) =>
          o._id === action.payload._id ? action.payload : o
        )
        toast.success("Order status updated!")
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })
  },
})

export const { clearOrderError, clearCreatedOrder } = orderSlice.actions
export default orderSlice.reducer