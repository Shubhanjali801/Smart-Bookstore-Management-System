import { useEffect } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { fetchAllOrders } from "../../features/orders/orderSlice"
import { fetchBooks } from "../../features/books/bookSlice"
import {
  Box, Grid, Card, CardContent, Typography,
  Button, Table, TableBody, TableCell,
  TableHead, TableRow, Chip, CircularProgress,
  Paper, Divider, Stack, Avatar
} from "@mui/material"
import {
  MenuBook, ShoppingBag, AttachMoney,
  Warning, ManageSearch, Inventory,
  TrendingUp, ArrowForward
} from "@mui/icons-material"

const AdminDashboard = () => {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const { orders, total: totalOrders, isLoading }
    = useSelector((state) => state.orders)
  const { books, total: totalBooks }
    = useSelector((state) => state.books)

  useEffect(() => {
    dispatch(fetchAllOrders())
    dispatch(fetchBooks({ limit: 100 }))
  }, [dispatch])

  const paidOrders = orders.filter((o) => o.paymentStatus === "Paid")
  const totalRevenue = paidOrders.reduce((sum, o) => sum + o.totalPrice, 0)
  const lowStockBooks = books.filter((b) => b.stock < 5)
  const pendingOrders = orders.filter((o) => o.orderStatus === "Created").length

  const stats = [
    {
      label: "Total Books",
      value: totalBooks,
      icon: <MenuBook />,
      color: "#534AB7",
      bg: "#EDE7F6",
      sub: `${lowStockBooks.length} low stock`,
      subColor: lowStockBooks.length > 0 ? "#E24B4A" : "#1D9E75",
    },
    {
      label: "Total Orders",
      value: totalOrders,
      icon: <ShoppingBag />,
      color: "#0C447C",
      bg: "#E3F2FD",
      sub: `${pendingOrders} pending`,
      subColor: "#EF9F27",
    },
    {
      label: "Revenue",
      value: `₹${totalRevenue.toLocaleString("en-IN")}`,
      icon: <AttachMoney />,
      color: "#27500A",
      bg: "#EAF3DE",
      sub: `${paidOrders.length} paid orders`,
      subColor: "#1D9E75",
    },
    {
      label: "Low Stock",
      value: lowStockBooks.length,
      icon: <Warning />,
      color: "#A32D2D",
      bg: "#FFEBEE",
      sub: lowStockBooks.length > 0
        ? "Needs attention" : "All good",
      subColor: lowStockBooks.length > 0 ? "#E24B4A" : "#1D9E75",
    },
  ]

  if (isLoading) return (
    <Box sx={{
      display: "flex", justifyContent: "center",
      alignItems: "center", minHeight: "60vh"
    }}>
      <CircularProgress size={48} />
    </Box>
  )

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", width: "100%" }}>

      {/* ── Header ── */}
      <Box sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        px: { xs: 2, md: 6 },
        py: 2.5,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <Box>
          <Typography variant="h5" fontWeight="800" color="#1a1a2e">
            Admin Dashboard
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Welcome back, Admin 👋 Here's what's happening today.
          </Typography>
        </Box>
        <Chip
          icon={<TrendingUp fontSize="small" />}
          label="Live Data"
          color="success"
          size="small"
          sx={{ fontWeight: 600 }}
        />
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, py: 4 }}>
        {/* ── Stats Grid ── */}
        <Grid container spacing={2.5} mb={4}>
          {stats.map((stat) => (
            <Grid item xs={6} sm={6} md={3} key={stat.label}>
              <Paper elevation={0} sx={{
                borderRadius: 3,
                p: 3,
                border: "1px solid #e8e8e8",
                bgcolor: "#fff",
                transition: "all 0.2s",
                "&:hover": { boxShadow: "0 4px 20px rgba(0,0,0,0.08)" },
              }}>
                <Box sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  mb: 2,
                }}>
                  <Box>
                    <Typography variant="body2"
                      color="text.secondary" fontWeight="500">
                      {stat.label}
                    </Typography>
                    <Typography variant="h4" fontWeight="800"
                      color={stat.color} mt={0.5}>
                      {stat.value}
                    </Typography>
                  </Box>
                  <Avatar sx={{
                    bgcolor: stat.bg,
                    color: stat.color,
                    width: 48, height: 48,
                  }}>
                    {stat.icon}
                  </Avatar>
                </Box>
                <Typography variant="caption"
                  color={stat.subColor} fontWeight="600">
                  {stat.sub}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* ── Quick Actions ── */}
        <Grid container spacing={2.5} mb={4}>
          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{
              borderRadius: 3,
              p: 3,
              border: "1px solid #e8e8e8",
              bgcolor: "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(83,74,183,0.15)",
                borderColor: "#534AB7",
              },
            }}
              onClick={() => navigate("/admin/books")}>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar sx={{
                    bgcolor: "#EDE7F6", color: "#534AB7",
                    width: 48, height: 48
                  }}>
                    <Inventory />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="700"
                      color="#1a1a2e">
                      Manage Books
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Add, edit or delete books from inventory
                    </Typography>
                  </Box>
                </Box>
                <ArrowForward color="primary" />
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6}>
            <Paper elevation={0} sx={{
              borderRadius: 3,
              p: 3,
              border: "1px solid #e8e8e8",
              bgcolor: "#fff",
              cursor: "pointer",
              transition: "all 0.2s",
              "&:hover": {
                boxShadow: "0 4px 20px rgba(29,158,117,0.15)",
                borderColor: "#1D9E75",
              },
            }}
              onClick={() => navigate("/admin/orders")}>
              <Box sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}>
                <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                  <Avatar sx={{
                    bgcolor: "#E1F5EE", color: "#1D9E75",
                    width: 48, height: 48
                  }}>
                    <ManageSearch />
                  </Avatar>
                  <Box>
                    <Typography variant="h6" fontWeight="700"
                      color="#1a1a2e">
                      Manage Orders
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      View and update order statuses
                    </Typography>
                  </Box>
                </Box>
                <ArrowForward sx={{ color: "#1D9E75" }} />
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {/* ── Recent Orders Table ── */}
        <Paper elevation={0} sx={{
          borderRadius: 3,
          border: "1px solid #e8e8e8",
          overflow: "hidden",
        }}>

          {/* Table header */}
          <Box sx={{
            px: 3, py: 2.5,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e8e8e8",
          }}>
            <Box>
              <Typography variant="h6" fontWeight="700" color="#1a1a2e">
                Recent Orders
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Latest 5 orders across all customers
              </Typography>
            </Box>
            <Button
              size="small"
              endIcon={<ArrowForward />}
              onClick={() => navigate("/admin/orders")}
              sx={{ borderRadius: 2 }}
            >
              View All
            </Button>
          </Box>

          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#fafafa" }}>
                {["Order ID", "Total", "Payment",
                  "Status", "Date"].map((h) => (
                    <TableCell key={h} sx={{
                      fontWeight: "700",
                      color: "text.secondary",
                      fontSize: "12px",
                      letterSpacing: 0.5,
                    }}>
                      {h.toUpperCase()}
                    </TableCell>
                  ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.slice(0, 5).map((order) => (
                <TableRow key={order._id} sx={{
                  "&:hover": { bgcolor: "#f9f9f9" },
                  borderBottom: "1px solid #f5f5f5",
                }}>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700"
                      fontFamily="monospace" color="#1a1a2e">
                      #{order._id.slice(-8).toUpperCase()}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="700"
                      color="success.main">
                      ₹{order.totalPrice.toLocaleString("en-IN")}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.paymentStatus}
                      color={order.paymentStatus === "Paid"
                        ? "success" : "warning"}
                      size="small"
                      sx={{ fontWeight: 600, fontSize: "11px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={order.orderStatus}
                      color="primary"
                      size="small"
                      variant="outlined"
                      sx={{ fontWeight: 600, fontSize: "11px" }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(order.createdAt)
                        .toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                    </Typography>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          {/* Low stock warning section */}
          {lowStockBooks.length > 0 && (
            <>
              <Divider />
              <Box sx={{ px: 3, py: 2.5 }}>
                <Typography variant="body2" fontWeight="700"
                  color="error.main" mb={1.5}>
                  ⚠️ Low Stock Alert ({lowStockBooks.length} books)
                </Typography>
                <Stack direction="row" spacing={1} flexWrap="wrap" gap={1}>
                  {lowStockBooks.map((book) => (
                    <Chip
                      key={book._id}
                      label={`${book.title} (${book.stock} left)`}
                      size="small"
                      color="error"
                      variant="outlined"
                      sx={{ fontSize: "11px" }}
                    />
                  ))}
                </Stack>
              </Box>
            </>
          )}

        </Paper>
      </Box>
    </Box>
  )
}

export default AdminDashboard