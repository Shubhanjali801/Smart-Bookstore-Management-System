import { useState } from "react"
import {
  Box, TextField, InputAdornment,
  IconButton, Chip, Stack
} from "@mui/material"
import { Search, Clear } from "@mui/icons-material"

const suggestions = [
  "Clean Code", "Fiction", "Self Help", "Programming", "Finance","Phycology"
]

const BookSearch = ({ value, onChange, onClear }) => {
  const [focused, setFocused] = useState(false)

  return (
    <Box sx={{ width: "100%" }}>
      <TextField
        fullWidth
        size="medium"
        placeholder="Search by title, author or genre..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setTimeout(() => setFocused(false), 200)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search color="action" />
            </InputAdornment>
          ),
          endAdornment: value && (
            <InputAdornment position="end">
              <IconButton size="small" onClick={onClear}>
                <Clear fontSize="small" />
              </IconButton>
            </InputAdornment>
          ),
          sx: { borderRadius: 3, bgcolor: "#fff" }
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
                sx={{ fontSize: "17px", bgcolor: "#fff" }}
              />
            ))}
          </Stack>
        </Box>
      )}
    </Box>
  )
}

export default BookSearch