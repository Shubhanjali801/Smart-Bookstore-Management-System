import { useNavigate } from "react-router-dom"
import { useDispatch } from "react-redux"
import { addToCart } from "../../features/cart/cartSlice"
import {
  Card, CardMedia, CardContent, CardActions,
  Typography, Button, Chip, Box, Tooltip
} from "@mui/material"
import { ShoppingCart, Visibility } from "@mui/icons-material"

// ── Component ─────────────────────────────────────────────────
const BookCard = ({ book }) => {
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const handleAddToCart = () => {
    dispatch(addToCart(book))
  }

  return (
    <Card sx={{
      height: "100%",
      display: "flex",
      flexDirection: "column",
      borderRadius: 3,
      transition: "transform 0.2s, box-shadow 0.2s",
      "&:hover": {
        transform: "translateY(-4px)",
        boxShadow: 6,
      },
    }}>

      {/* Book Cover Image */}
      <CardMedia
        component="img"
        height="220"
        image={book.imageUrl ||"https://via.placeholder.com/200x280?text=No+Cover"}
        alt={book.title}
        sx={{ objectFit: "cover", cursor: "pointer" }}
        onClick={() => navigate(`/books/${book._id}`)}
      />

      <CardContent sx={{ flex: 1, pb: 1 }}>

        {/* Genre Chip */}
        <Chip
          label={book.genre || "General"}
          size="small"
          color="primary"
          variant="outlined"
          sx={{ mb: 1 }}
        />

        {/* Title */}
        <Tooltip title={book.title} placement="top">
          <Typography
            variant="subtitle1"
            fontWeight="600"
            sx={{
              cursor: "pointer",
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              lineHeight: 1.3,
              mb: 0.5,
              "&:hover": { color: "primary.main" },
            }}
            onClick={() => navigate(`/books/${book._id}`)}
          >
            {book.title}
          </Typography>
        </Tooltip>

        {/* Author */}
        <Typography variant="body2" color="text.secondary" gutterBottom>
          by {book.author}
        </Typography>

        {/* Price + Stock */}
        <Box sx={{ display: "flex", justifyContent: "space-between",
          alignItems: "center", mt: 1 }}>
          <Typography variant="h6" color="success.main" fontWeight="bold">
            ₹{book.price}
          </Typography>
          <Typography
            variant="caption"
            fontWeight="500"
            color={book.stock > 0 ? "success.main" : "error.main"}
          >
            {book.stock > 0 ? `${book.stock} in stock` : "Out of stock"}
          </Typography>
        </Box>

      </CardContent>

      {/* Action Buttons */}
      <CardActions sx={{ px: 2, pb: 2, gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          fullWidth
          startIcon={<ShoppingCart />}
          disabled={book.stock === 0}
          onClick={handleAddToCart}
          sx={{ borderRadius: 2 }}
        >
          {book.stock === 0 ? "Out of Stock" : "Add to Cart"}
        </Button>
        <Button
          variant="outlined"
          size="small"
          startIcon={<Visibility />}
          onClick={() => navigate(`/books/${book._id}`)}
          sx={{ borderRadius: 2, minWidth: "auto", px: 1.5 }}
        >
          View
        </Button>
      </CardActions>

    </Card>
  )
}

export default BookCard