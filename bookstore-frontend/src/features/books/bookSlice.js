import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"

// ── Async Actions ──────────────────────────────────────────────

// Fetch all books with search and filter
export const fetchBooks = createAsyncThunk(
  "books/fetchAll",
  async (params, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get("/api/books", { params })
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch books"
      )
    }
  }
)

// Fetch single book
export const fetchBookById = createAsyncThunk(
  "books/fetchById",
  async (id, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/api/books/${id}`)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to fetch book"
      )
    }
  }
)

// Create book (admin)
export const createBook = createAsyncThunk(
  "books/create",
  async (bookData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post("/api/books", bookData)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to create book"
      )
    }
  }
)

// Update book (admin)
export const updateBook = createAsyncThunk(
  "books/update",
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/api/books/${id}`, data)
      return res.data
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to update book"
      )
    }
  }
)

// Delete book (admin)
export const deleteBook = createAsyncThunk(
  "books/delete",
  async (id, { rejectWithValue }) => {
    try {
      await axiosInstance.delete(`/api/books/${id}`)
      return id
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || error.message || "Failed to delete book"
      )
    }
  }
)

// ── Initial State ──────────────────────────────────────────────

const initialState = {
  books: [],
  book: null,
  total: 0,
  page: 1,
  pages: 1,
  isLoading: false,
  error: null,
}

// ── Slice ──────────────────────────────────────────────────────

const bookSlice = createSlice({
  name: "books",
  initialState,
  reducers: {
    clearBookError: (state) => {
      state.error = null
    },
    clearBook: (state) => {
      state.book = null
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch all books
      .addCase(fetchBooks.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBooks.fulfilled, (state, action) => {
        state.isLoading = false
        state.books = action.payload.books
        state.total = action.payload.total
        state.page = action.payload.page
        state.pages = action.payload.pages
      })
      .addCase(fetchBooks.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Fetch single book
      .addCase(fetchBookById.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchBookById.fulfilled, (state, action) => {
        state.isLoading = false
        state.book = action.payload
      })
      .addCase(fetchBookById.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Create book
      .addCase(createBook.pending, (state) => {
        state.isLoading = true
      })
      .addCase(createBook.fulfilled, (state, action) => {
        state.isLoading = false
        state.books.unshift(action.payload)
        toast.success("Book created successfully!")
      })
      .addCase(createBook.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Update book
      .addCase(updateBook.pending, (state) => {
        state.isLoading = true
      })
      .addCase(updateBook.fulfilled, (state, action) => {
        state.isLoading = false
        state.books = state.books.map((b) =>
          b._id === action.payload._id ? action.payload : b
        )
        toast.success("Book updated successfully!")
      })
      .addCase(updateBook.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })

      // Delete book
      .addCase(deleteBook.pending, (state) => {
        state.isLoading = true
      })
      .addCase(deleteBook.fulfilled, (state, action) => {
        state.isLoading = false
        state.books = state.books.filter((b) => b._id !== action.payload)
        toast.success("Book deleted successfully!")
      })
      .addCase(deleteBook.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
        toast.error(action.payload)
      })
  },
})

export const { clearBookError, clearBook } = bookSlice.actions
export default bookSlice.reducer