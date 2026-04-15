import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useSelector, useDispatch } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"
import {
  Box, Card, CardContent, TextField, Button,
  Typography, CircularProgress, InputAdornment, IconButton
} from "@mui/material"
import { Visibility, VisibilityOff, MenuBook } from "@mui/icons-material"
import { loginUser } from "../../features/auth/authSlice"

// ── Validation Schema ──────────────────────────────────────────
const schema = yup.object({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup.string().required("Password is required"),
})

// ── Component ──────────────────────────────────────────────────
const LoginPage = () => {
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    if (token) navigate("/books")
  }, [token, navigate])

  const onSubmit = async (data) => {
    try {
      setIsLoading(true)
      const res = await axiosInstance.post("/api/auth/login", data)
      dispatch(loginUser(res.data))
      toast.success("Login successful! Welcome back 👋")
      navigate("/books")
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      backgroundColor: "#f0f2f5",
    }}>
      <Card sx={{ width: 420, borderRadius: 3, boxShadow: 5 }}>
        <CardContent sx={{ p: 4 }}>

          {/* Logo / Title */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <MenuBook sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Welcome Back
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Login to your Bookstore account
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>

            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              {...register("email")}
              error={!!errors.email}
              helperText={errors.email?.message}
            />

            <TextField
              label="Password"
              type={showPassword ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("password")}
              error={!!errors.password}
              helperText={errors.password?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />

            <Button
              type="submit"
              variant="contained"
              fullWidth
              size="large"
              disabled={isLoading}
              sx={{ mt: 3, borderRadius: 2, py: 1.5 }}
            >
              {isLoading
                ? <CircularProgress size={24} color="inherit" />
                : "Login"
              }
            </Button>

            <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#1976d2", fontWeight: "bold" }}>
                Register here
              </Link>
            </Typography>

          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default LoginPage