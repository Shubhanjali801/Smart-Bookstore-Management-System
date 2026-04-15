import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"

// ── Async Actions ──────────────────────────────────────────────

// Register (async thunk — used if needed)
export const registerUser = createAsyncThunk(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/auth/register", userData)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Registration failed"
      )
    }
  }
)

// Get Profile
export const getProfile = createAsyncThunk(
  "auth/getProfile",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/auth/profile")
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch profile"
      )
    }
  }
)

// ── Initial State ──────────────────────────────────────────────

const token = localStorage.getItem("token")

let user = null
try {
  user = JSON.parse(localStorage.getItem("user"))
} catch {
  user = null
}

const initialState = {
  token: token || null,
  user: user || null,
  isLoading: false,
  error: null,
}

// ── Slice ──────────────────────────────────────────────────────

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {

    // ← NEW: called directly from LoginPage after axios call succeeds
    loginUser: (state, action) => {
      state.token = action.payload.token
      state.user = {
        _id: action.payload._id,
        name: action.payload.name,
        email: action.payload.email,
        role: action.payload.role,
        phone: action.payload.phone,
        address: action.payload.address,
      }
      localStorage.setItem("token", action.payload.token)
      localStorage.setItem("user", JSON.stringify(state.user))
    },

    logout: (state) => {
      state.token = null
      state.user = null
      localStorage.removeItem("token")
      localStorage.removeItem("user")
      toast.success("Logged out successfully!")
    },

    clearError: (state) => {
      state.error = null
    },
  },

  extraReducers: (builder) => {
    builder

      // Register
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false
        state.token = action.payload.token
        state.user = {
          _id: action.payload._id,
          name: action.payload.name,
          email: action.payload.email,
          role: action.payload.role,
          phone: action.payload.phone,
          address: action.payload.address,
        }
        localStorage.setItem("token", action.payload.token)
        localStorage.setItem("user", JSON.stringify(state.user))
        toast.success("Registration successful! Welcome 🎉")
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Get Profile
      .addCase(getProfile.pending, (state) => {
        state.isLoading = true
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isLoading = false
        state.user = action.payload
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
  },
})

export const { loginUser, logout, clearError } = authSlice.actions
export default authSlice.reducer