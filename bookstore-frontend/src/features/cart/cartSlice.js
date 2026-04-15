import { createSlice } from "@reduxjs/toolkit"
import { toast } from "react-toastify"

// ── Initial State ──────────────────────────────────────────────

const initialState = {
  items: [],
}

// ── Slice ──────────────────────────────────────────────────────

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addToCart: (state, action) => {
      const existing = state.items.find((i) => i._id === action.payload._id)
      if (existing) {
        if (existing.quantity < action.payload.stock) {
          existing.quantity += 1
          toast.success("Quantity updated in cart!")
        } else {
          toast.error("Not enough stock available!")
        }
      } else {
        state.items.push({ ...action.payload, quantity: 1 })
        toast.success(`"${action.payload.title}" added to cart!`)
      }
    },
    removeFromCart: (state, action) => {
      state.items = state.items.filter((i) => i._id !== action.payload)
      toast.info("Item removed from cart")
    },
    updateQuantity: (state, action) => {
      const item = state.items.find((i) => i._id === action.payload.id)
      if (item) {
        item.quantity = action.payload.quantity
      }
    },
    clearCart: (state) => {
      state.items = []
    },
  },
})

export const { addToCart, removeFromCart, updateQuantity, clearCart } =
  cartSlice.actions

export const selectCartTotal = (state) =>
  state.cart.items.reduce((total, item) => total + item.price * item.quantity, 0)

export const selectCartCount = (state) =>
  state.cart.items.reduce((count, item) => count + item.quantity, 0)

export default cartSlice.reducer