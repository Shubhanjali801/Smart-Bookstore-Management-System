import { useSelector } from "react-redux"
import {
  Box, Typography, Paper, Avatar,
  Divider, Chip
} from "@mui/material"
import {
  Person, Email, Phone, LocationOn,
  AdminPanelSettings, ShoppingBag
} from "@mui/icons-material"

const ProfilePage = () => {
  const { user } = useSelector((state) => state.auth)

  if (!user) return null

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", width: "100%" }}>

      {/* Header */}
      <Box sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        px: { xs: 2, md: 6 },
        py: 1,
      }}>
        <Typography variant="h5" fontWeight="800" color="#1a1a2e">
          My Profile
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Your account information
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, md: 6 }, py: 4, maxWidth: 600 }}>
        <Paper elevation={0} sx={{
          borderRadius: 3,
          border: "1px solid #e8e8e8",
          overflow: "hidden",
        }}>

          {/* Avatar section */}
          <Box sx={{
            bgcolor: "#534AB7",
            py: 4,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1.5,
          }}>
            <Avatar sx={{
              width: 80, height: 80,
              bgcolor: "#fff",
              color: "#534AB7",
              fontSize: "30px",
              fontWeight: 800,
            }}>
              {user.name?.charAt(0).toUpperCase()}
            </Avatar>
            <Typography variant="h6" color="#fff" fontWeight="700">
              {user.name}
            </Typography>
            <Chip
              label={user.role === "admin" ? "Admin" : "Customer"}
              icon={user.role === "admin"
                ? <AdminPanelSettings sx={{ color: "#fff !important" }} />
                : <ShoppingBag sx={{ color: "#fff !important" }} />
              }
              sx={{
                bgcolor: user.role === "admin"
                  ? "rgba(255,255,255,0.25)"
                  : "rgba(255,255,255,0.15)",
                color: "#fff",
                fontWeight: 600,
                fontSize: "12px",
              }}
            />
          </Box>

          {/* Info rows */}
          <Box sx={{ p: 3 }}>
            {[
              { icon: <Person />, label: "Full Name", value: user.name },
              { icon: <Email />, label: "Email", value: user.email },
              { icon: <Phone />, label: "Phone", value: user.phone || "Not provided" },
              { icon: <LocationOn />, label: "Address", value: user.address || "Not provided" },
            ].map((item, i) => (
              <Box key={i}>
                <Box sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 2,
                  py: 2,
                }}>
                  <Box sx={{
                    color: "#534AB7",
                    mt: 0.3,
                    flexShrink: 0,
                  }}>
                    {item.icon}
                  </Box>
                  <Box>
                    <Typography variant="caption"
                      color="text.secondary"
                      fontWeight="600"
                      display="block">
                      {item.label}
                    </Typography>
                    <Typography variant="body1"
                      color="#1a1a2e"
                      fontWeight="500">
                      {item.value}
                    </Typography>
                  </Box>
                </Box>
                {i < 3 && <Divider />}
              </Box>
            ))}
          </Box>

        </Paper>
      </Box>
    </Box>
  )
}

export default ProfilePage