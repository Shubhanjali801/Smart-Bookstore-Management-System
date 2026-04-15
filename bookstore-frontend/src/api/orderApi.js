import axiosInstance from "./axiosInstance"

// ── Order API calls ────────────────────────────────────────────
export const createOrderApi  = (data) => axiosInstance.post("/api/orders", data)
export const fetchMyOrders   = ()     => axiosInstance.get("/api/orders/my")
export const fetchOrderById  = (id)   => axiosInstance.get(`/api/orders/${id}`)

// ── Admin Order Management ─────────────────────────────────────
export const fetchAllOrders    = ()             => axiosInstance.get("/api/orders")
export const updateOrderStatus = (id, status)   => axiosInstance.put(`/api/orders/${id}/status`, { orderStatus: status })