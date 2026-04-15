import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import {
  fetchAllOrders, updateOrderStatus
} from "../../features/orders/orderSlice"
import {
  Box, Typography, Card, CardContent, Table,
  TableBody, TableCell, TableHead, TableRow,
  Chip, Select, MenuItem, CircularProgress,
  FormControl, InputLabel
} from "@mui/material"

// ── Status config ──────────────────────────────────────────────
const statuses = [
  "Created", "Confirmed", "Processing",
  "Shipped", "Delivered", "Cancelled"
]

const statusColor = {
  Created:    "info",
  Confirmed:  "success",
  Processing: "warning",
  Shipped:    "primary",
  Delivered:  "success",
  Cancelled:  "error",
}

// ── Component ─────────────────────────────────────────────────
const AdminOrdersPage = () => {
  const dispatch = useDispatch()
  const { orders, isLoading } = useSelector((state) => state.orders)
  const [filterStatus, setFilterStatus] = useState("")

  useEffect(() => {
    dispatch(fetchAllOrders(filterStatus ? { status: filterStatus } : {}))
  }, [dispatch, filterStatus])

  const handleStatusChange = (orderId, newStatus) => {
    dispatch(updateOrderStatus({ id: orderId, orderStatus: newStatus }))
  }

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", px: 3, py: 4 }}>

      <Box sx={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Orders ({orders.length})
        </Typography>

        <FormControl size="small" sx={{ minWidth: 180 }}>
          <InputLabel>Filter by Status</InputLabel>
          <Select
            value={filterStatus}
            label="Filter by Status"
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <MenuItem value="">All Statuses</MenuItem>
            {statuses.map((s) => (
              <MenuItem key={s} value={s}>{s}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0, overflowX: "auto" }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table sx={{ minWidth: 800 }}>
              <TableHead>
                <TableRow sx={{ background: "#f5f5f5" }}>
                  {["Order ID", "Customer", "Total",
                    "Payment", "Status", "Update Status", "Date"
                  ].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: "bold",
                      whiteSpace: "nowrap" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order._id}
                    sx={{ "&:hover": { background: "#fafafa" } }}>
                    <TableCell>
                      #{order._id.slice(-8).toUpperCase()}
                    </TableCell>
                    <TableCell>
                      <Typography variant="body2" fontWeight="500">
                        {order.userId?.name}
                      </Typography>
                      <Typography variant="caption"
                        color="text.secondary">
                        {order.userId?.email}
                      </Typography>
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
                      <Chip
                        label={order.orderStatus}
                        color={statusColor[order.orderStatus] || "default"}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Select
                        value={order.orderStatus}
                        size="small"
                        onChange={(e) =>
                          handleStatusChange(order._id, e.target.value)}
                        sx={{ minWidth: 130, fontSize: "13px" }}
                      >
                        {statuses.map((s) => (
                          <MenuItem key={s} value={s}>{s}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell sx={{ whiteSpace: "nowrap" }}>
                      {new Date(order.createdAt)
                        .toLocaleDateString("en-IN")}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </Box>
  )
}

export default AdminOrdersPage