import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import { useSelector } from "react-redux"
import { useNavigate, Link } from "react-router-dom"
import axiosInstance from "../../api/axiosInstance"
import { toast } from "react-toastify"
import {
  Box, Card, CardContent, TextField, Button,
  Typography, CircularProgress, InputAdornment,
  IconButton
} from "@mui/material"
import { Visibility, VisibilityOff, MenuBook } from "@mui/icons-material"

// ── Validation Schema ──────────────────────────────────────────
const schema = yup.object({
  name: yup.string().required("Name is required").min(2, "Min 2 characters"),
  email: yup.string().email("Invalid email").required("Email is required"),
  phone: yup.string().min(10, "Min 10 digits"),
  address: yup.string(),
  password: yup.string().min(8, "Min 8 characters").required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please confirm your password"),
})

// ── Component ──────────────────────────────────────────────────
const RegisterPage = () => {
  const navigate = useNavigate()
  const { token } = useSelector((state) => state.auth)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
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
      const { confirmPassword: _confirmPassword, ...payload } = data 
      await axiosInstance.post("/api/auth/register", payload)
      toast.success("Registered successfully! Please login 🎉")
      navigate("/login")
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex",
      alignItems: "center", justifyContent: "center",
      backgroundColor: "#f0f2f5", py: 4,
    }}>
      <Card sx={{ width: 480, borderRadius: 3, boxShadow: 5 }}>
        <CardContent sx={{ p: 4 }}>

          {/* Logo / Title */}
          <Box sx={{ textAlign: "center", mb: 3 }}>
            <MenuBook sx={{ fontSize: 48, color: "primary.main" }} />
            <Typography variant="h5" fontWeight="bold" mt={1}>
              Create Account
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Join Bookstore and start reading
            </Typography>
          </Box>

          {/* Form */}
          <Box component="form" onSubmit={handleSubmit(onSubmit)}>

            <TextField
              label="Full Name"
              fullWidth
              margin="normal"
              {...register("name")}
              error={!!errors.name}
              helperText={errors.name?.message}
            />

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
              label="Phone Number"
              fullWidth
              margin="normal"
              {...register("phone")}
              error={!!errors.phone}
              helperText={errors.phone?.message}
            />

            <TextField
              label="Address"
              fullWidth
              margin="normal"
              multiline
              rows={2}
              {...register("address")}
              error={!!errors.address}
              helperText={errors.address?.message}
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

            <TextField
              label="Confirm Password"
              type={showConfirm ? "text" : "password"}
              fullWidth
              margin="normal"
              {...register("confirmPassword")}
              error={!!errors.confirmPassword}
              helperText={errors.confirmPassword?.message}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowConfirm(!showConfirm)}>
                      {showConfirm ? <VisibilityOff /> : <Visibility />}
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
                : "Create Account"
              }
            </Button>

            <Typography variant="body2" textAlign="center" mt={2} color="text.secondary">
              Already have an account?{" "}
              <Link to="/login" style={{ color: "#1976d2", fontWeight: "bold" }}>
                Sign In
              </Link>
            </Typography>

          </Box>
        </CardContent>
      </Card>
    </Box>
  )
}

export default RegisterPage