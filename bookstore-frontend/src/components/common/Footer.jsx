import { Box, Typography } from "@mui/material"

const Footer = () => {
  return (
    <Box component="footer" sx={{
      background: "#1a1a2e",
      color: "#888",
      textAlign: "center",
      py: 2,
      px: 4,
      mt: "auto",
    }}>
      <Typography variant="body2" sx={{ fontSize: "13px" }}>
        © 2026 Bookstore Management System. All rights reserved.
      </Typography>
    </Box>
  )
}

export default Footer
