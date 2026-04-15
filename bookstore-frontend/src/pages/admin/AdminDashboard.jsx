import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchAllOrders } from "../../features/orders/orderSlice"
import { fetchBooks } from "../../features/books/bookSlice"
import {
  Box, Grid, Card, CardContent, Typography,
  Button, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, CircularProgress
} from "@mui/material"
import {
  MenuBook, ShoppingBag, AttachMoney,
  Warning, ManageSearch, Inventory
} from "@mui/icons-material"

// ── Component ─────────────────────────────────────────────────
const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, total: totalOrders, isLoading }
    = useSelector((state) => state.orders)
  const { books, total: totalBooks } = useSelector((state) => state.books)

  useEffect(() => {
    dispatch(fetchAllOrders())
    dispatch(fetchBooks({ limit: 50 }))
  }, [dispatch])

  const totalRevenue = orders
    .filter((o) => o.paymentStatus === "Paid")
    .reduce((sum, o) => sum + o.totalPrice, 0)

  const lowStockBooks = books.filter((b) => b.stock < 5)

  const stats = [
    { label: "Total Books", value: totalBooks,
      icon: <MenuBook />, color: "#1976d2", bg: "#E3F2FD" },
    { label: "Total Orders", value: totalOrders,
      icon: <ShoppingBag />, color: "#388e3c", bg: "#E8F5E9" },
    { label: "Revenue (Paid)", value: `₹${totalRevenue}`,
      icon: <AttachMoney />, color: "#f57c00", bg: "#FFF3E0" },
    { label: "Low Stock", value: lowStockBooks.length,
      icon: <Warning />, color: "#d32f2f", bg: "#FFEBEE" },
  ]

  if (isLoading) return (
    <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
      <CircularProgress />
    </Box>
  )

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 4 }}>
      <Typography variant="h4" fontWeight="bold" mb={4}>
        Admin Dashboard
      </Typography>

      {/* Stats */}
      <Grid container spacing={3} mb={4}>
        {stats.map((stat) => (
          <Grid item xs={12} sm={6} md={3} key={stat.label}>
            <Card sx={{ borderRadius: 3, background: stat.bg }}>
              <CardContent>
                <Box sx={{ display: "flex", justifyContent: "space-between",
                  alignItems: "center" }}>
                  <Box>
                    <Typography variant="h4" fontWeight="bold"
                      color={stat.color}>{stat.value}</Typography>
                    <Typography variant="body2" color={stat.color}>
                      {stat.label}
                    </Typography>
                  </Box>
                  <Box sx={{ color: stat.color, opacity: 0.7 }}>
                    {stat.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Quick Links */}
      <Grid container spacing={3} mb={4}>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, cursor: "pointer",
            "&:hover": { boxShadow: 6 } }}
            onClick={() => navigate("/admin/books")}>
            <CardContent sx={{ display: "flex",
              justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  📚 Manage Books
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Add, edit or delete books
                </Typography>
              </Box>
              <Inventory color="primary" fontSize="large" />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card sx={{ borderRadius: 3, cursor: "pointer",
            "&:hover": { boxShadow: 6 } }}
            onClick={() => navigate("/admin/orders")}>
            <CardContent sx={{ display: "flex",
              justifyContent: "space-between", alignItems: "center" }}>
              <Box>
                <Typography variant="h6" fontWeight="bold">
                  📦 Manage Orders
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  View and update order statuses
                </Typography>
              </Box>
              <ManageSearch color="primary" fontSize="large" />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Recent Orders Table */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" mb={2}>
            Recent Orders
          </Typography>
          <Table>
            <TableHead>
              <TableRow sx={{ background: "#f5f5f5" }}>
                {["Order ID", "Total", "Payment", "Status", "Date"]
                  .map((h) => (
                    <TableCell key={h} sx={{ fontWeight: "bold" }}>
                      {h}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order._id}
                  sx={{ "&:hover": { background: "#fafafa" } }}>
                  <TableCell>
                    #{order._id.slice(-8).toUpperCase()}
                  </TableCell>
                  <TableCell>₹{order.totalPrice}</TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentStatus}
                      color={order.paymentStatus === "Paid"
                        ? "success" : "warning"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip label={order.orderStatus}
                      color="primary" size="small" variant="outlined" />
                  </TableCell>
                  <TableCell>
                    {new Date(order.createdAt)
                      .toLocaleDateString("en-IN")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminDashboard