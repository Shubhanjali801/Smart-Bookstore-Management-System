import { Chip } from "@mui/material"

const statusColor = {
  Created:    "info",
  Confirmed:  "success",
  Processing: "warning",
  Shipped:    "primary",
  Delivered:  "success",
  Cancelled:  "error",
}

const OrderStatusBadge = ({ status }) => {
  return (
    <Chip
      label={status}
      color={statusColor[status] || "default"}
      size="medium"
    />
  )
}

export default OrderStatusBadge
