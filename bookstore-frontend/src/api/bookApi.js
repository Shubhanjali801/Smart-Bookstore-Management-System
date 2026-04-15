import axiosInstance from "./axiosInstance"

// ── Book API calls ─────────────────────────────────────────────
export const fetchBooks = (params) => axiosInstance.get("/api/books", { params })
export const fetchBook  = (id)     => axiosInstance.get(`/api/books/${id}`)

// ── Admin Book Management ──────────────────────────────────────
export const createBook = (data)      => axiosInstance.post("/api/books", data)
export const updateBook = (id, data)  => axiosInstance.put(`/api/books/${id}`, data)
export const deleteBook = (id)        => axiosInstance.delete(`/api/books/${id}`)