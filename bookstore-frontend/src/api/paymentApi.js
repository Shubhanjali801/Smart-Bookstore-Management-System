import axiosInstance from "./axiosInstance"

// ── Payment API calls ──────────────────────────────────────────
export const createPaymentIntent = (orderId) => axiosInstance.post("/api/payment/create-intent", { orderId })
export const fetchPaymentByOrder = (orderId) => axiosInstance.get(`/api/payment/order/${orderId}`)