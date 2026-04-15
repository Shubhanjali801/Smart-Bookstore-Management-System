import axiosInstance from "./axiosInstance"

// ── Email Log API calls (Admin only) ──────────────────────────
export const fetchEmailLogs       = (params)  => axiosInstance.get("/api/emails", { params })
export const fetchEmailLogsByUser = (userId)  => axiosInstance.get(`/api/emails/user/${userId}`)
