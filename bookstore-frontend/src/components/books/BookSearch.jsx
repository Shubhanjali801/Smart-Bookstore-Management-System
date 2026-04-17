import { useState } from "react"
import {
  Box, TextField, InputAdornment,
  IconButton, Chip, Stack
} from "@mui/material"
import { Search, Clear } from "@mui/icons-material"

const suggestions = [
 "Psychology", "Business","Memoir","Poetry" ]

const BookSearch = ({ value, onChange, onClear }) => {
  const [focused, setFocused] = useState(false)

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        size="small"
        placeholder="Search by title, author or genre..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" fontSize="small" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear}>
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: {
            borderRadius: 3,
            bgcolor: "#fff",
            height: 38,
            fontSize: "13px",
          }
        }}
        sx={{
          "& .MuiOutlinedInput-input": {
            py: 0.8,
            fontSize: "13px",
          }
        }}
      />

      {/* Quick suggestions */}
      {focused && !value && (
        <Box sx={{ mt: 1 }}>
          <Stack direction="row" flexWrap="wrap" gap={1}>
            {suggestions.map((s) => (
              <Chip
                key={s}
                label={s}
                size="small"
                variant="outlined"
                clickable
                onClick={() => onChange(s)}
                sx={{ fontSize: "12px", bgcolor: "#fff" }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default BookSearch