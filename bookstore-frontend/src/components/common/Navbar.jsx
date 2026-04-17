import { useDispatch, useSelector } from "react-redux"
import { useNavigate, Link as RouterLink } from "react-router-dom"
import { logout } from "../../features/auth/authSlice"
import { selectCartCount } from "../../features/cart/cartSlice"
import {
  AppBar, Toolbar, Typography, Button,
  IconButton, Badge, Box, Chip
} from "@mui/material"
import {
  ShoppingCart, MenuBook, Logout,
  Dashboard, LibraryBooks
} from "@mui/icons-material"

// ── Component ─────────────────────────────────────────────────
const Navbar = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { user, token } = useSelector((state) => state.auth)
  const cartCount = useSelector(selectCartCount)

  const handleLogout = () => {
    dispatch(logout())
    navigate("/login")
  }

  return (
    <AppBar position="sticky" sx={{ background: "#1a1a2e" }}>
      <Toolbar sx={{ justifyContent: "space-between" }}>

        {/* Brand */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1,
          cursor: "pointer" }}
          onClick={() => navigate("/books")}>
          <MenuBook />
          <Typography variant="h6" fontWeight="bold">
            Bookstore
          </Typography>
        </Box>

        {/* Nav Links */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>

          <Button color="inherit" component={RouterLink} to="/books"
            startIcon={<LibraryBooks />}>
            Books
          </Button>

          {token && (
            <>
              <IconButton color="inherit"
                onClick={() => navigate("/cart")}>
                <Badge badgeContent={cartCount} color="error">
                  <ShoppingCart />
                </Badge>
              </IconButton>

              <Button color="inherit"
                onClick={() => navigate("/orders")}>
                My Orders
              </Button>
            </>
          )}

          {user?.role === "admin" && (
            <Button color="inherit" startIcon={<Dashboard />}
              onClick={() => navigate("/admin")}
              sx={{ color: "#7F77DD", fontWeight: "bold" }}>
              Admin
            </Button>
          )}

          {token ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Chip
                label={`Hi, ${user?.name?.split(" ")[0]}`}
                size="medium"
                sx={{ color: "#9FE1CB", border: "1px solid #9FE1CB",
                  background: "transparent" }}
              />
              <IconButton color="inherit" onClick={handleLogout}
                title="Logout">
                <Logout fontSize="small" />
              </IconButton>
            </Box>
          ) : (
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button color="inherit"
                component={RouterLink} to="/login">
                Login
              </Button>
              <Button variant="outlined" color="inherit"
                component={RouterLink} to="/register"
                sx={{ borderRadius: 2 }}>
                Register
              </Button>
            </Box>
          )}

        </Box>
      </Toolbar>
    </AppBar>
  )
}

export default Navbar