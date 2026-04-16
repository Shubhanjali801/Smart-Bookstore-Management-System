import axiosInstance from "./axiosInstance"

// ── Auth API calls ─────────────────────────────────────────────
export const loginApi      = (data) => axiosInstance.post("/api/auth/login", data)
export const registerApi   = (data) => axiosInstance.post("/api/auth/register", data)
export const getProfileApi = ()     => axiosInstance.get("/api/auth/profile")

// ── Admin User Management ──────────────────────────────────────
export const fetchUsers   = ()   => axiosInstance.get("/api/auth/users")
export const promoteAdmin = (id) => axiosInstance.put(`/api/auth/promote/${id}`)