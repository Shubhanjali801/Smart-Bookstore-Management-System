import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useForm } from "react-hook-form"
import { yupResolver } from "@hookform/resolvers/yup"
import * as yup from "yup"
import {
  fetchBooks, createBook, updateBook, deleteBook
} from "../../features/books/bookSlice"
import {
  Box, Typography, Button, Card, CardContent,
  TextField, Table, TableBody, TableCell,
  TableHead, TableRow, IconButton, Dialog,
  DialogTitle, DialogContent, DialogActions,
  Grid, Chip, CircularProgress, InputAdornment
} from "@mui/material"
import {
  Add, Edit, Delete, Search
} from "@mui/icons-material"

// ── Validation ─────────────────────────────────────────────────
const schema = yup.object({
  title:       yup.string().required("Title is required"),
  author:      yup.string().required("Author is required"),
  genre:       yup.string().required("Genre is required"),
  price:       yup.number().positive().required("Price is required"),
  stock:       yup.number().min(0).required("Stock is required"),
  isbn:        yup.string().required("ISBN is required"),
  description: yup.string(),
  imageUrl:    yup.string().url("Must be a valid URL").nullable(),
})

// ── Component ─────────────────────────────────────────────────
const AdminBooksPage = () => {
  const dispatch = useDispatch()
  const { books, isLoading } = useSelector((state) => state.books)

  const [open, setOpen] = useState(false)
  const [editingBook, setEditingBook] = useState(null)
  const [search, setSearch] = useState("")
  const [deleteConfirm, setDeleteConfirm] = useState(null)

  const { register, handleSubmit, reset,
    formState: { errors } } = useForm({
    resolver: yupResolver(schema),
  })

  useEffect(() => {
    dispatch(fetchBooks({ limit: 100 }))
  }, [dispatch])

  const handleOpen = (book = null) => {
    setEditingBook(book)
    reset(book || {})
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
    setEditingBook(null)
    reset({})
  }

  const onSubmit = (data) => {
    if (editingBook) {
      dispatch(updateBook({ id: editingBook._id, data }))
    } else {
      dispatch(createBook(data))
    }
    handleClose()
  }

  const handleDelete = (id) => {
    dispatch(deleteBook(id))
    setDeleteConfirm(null)
  }

  const filtered = books.filter((b) =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <Box sx={{ maxWidth: 1100, mx: "auto", px: 3, py: 4 }}>

      {/* Header */}
      <Box sx={{ display: "flex", justifyContent: "space-between",
        alignItems: "center", mb: 3 }}>
        <Typography variant="h4" fontWeight="bold">
          Manage Books ({books.length})
        </Typography>
        <Button variant="contained" startIcon={<Add />}
          onClick={() => handleOpen()}
          sx={{ borderRadius: 2 }}>
          Add Book
        </Button>
      </Box>

      {/* Search */}
      <TextField
        placeholder="Search books..."
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        size="small"
        sx={{ mb: 3, maxWidth: 400 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search fontSize="small" />
            </InputAdornment>
          )
        }}
      />

      {/* Table */}
      <Card sx={{ borderRadius: 3 }}>
        <CardContent sx={{ p: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress />
            </Box>
          ) : (
            <Table>
              <TableHead>
                <TableRow sx={{ background: "#f5f5f5" }}>
                  {["Book", "Genre", "Price", "Stock", "Actions"].map((h) => (
                    <TableCell key={h} sx={{ fontWeight: "bold" }}>{h}</TableCell>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((book) => (
                  <TableRow key={book._id}
                    sx={{ "&:hover": { background: "#fafafa" } }}>
                    <TableCell>
                      <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <Box component="img"
                          src={book.imageUrl ||
                            "https://via.placeholder.com/40x50"}
                          sx={{ width: 40, height: 50,
                            objectFit: "cover", borderRadius: 1 }}
                        />
                        <Box>
                          <Typography variant="body2" fontWeight="600">
                            {book.title}
                          </Typography>
                          <Typography variant="caption"
                            color="text.secondary">
                            {book.author}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Chip label={book.genre} size="small"
                        color="primary" variant="outlined" />
                    </TableCell>
                    <TableCell>₹{book.price}</TableCell>
                    <TableCell>
                      <Typography fontWeight="600"
                        color={book.stock < 5
                          ? "error.main" : "success.main"}>
                        {book.stock}
                      </Typography>
                    </TableCell>
                    <TableCell>
                      <IconButton color="primary" size="small"
                        onClick={() => handleOpen(book)}>
                        <Edit fontSize="small" />
                      </IconButton>
                      <IconButton color="error" size="small"
                        onClick={() => setDeleteConfirm(book._id)}>
                        <Delete fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add / Edit Dialog */}
      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle fontWeight="bold">
          {editingBook ? "Edit Book" : "Add New Book"}
        </DialogTitle>
        <DialogContent>
          <Box component="form" id="book-form"
            onSubmit={handleSubmit(onSubmit)}
            sx={{ display: "flex", flexDirection: "column", gap: 0 }}>
            <Grid container spacing={2} sx={{ mt: 0.5 }}>
              <Grid item xs={6}>
                <TextField label="Title" fullWidth
                  {...register("title")}
                  error={!!errors.title}
                  helperText={errors.title?.message} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Author" fullWidth
                  {...register("author")}
                  error={!!errors.author}
                  helperText={errors.author?.message} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Genre" fullWidth
                  {...register("genre")}
                  error={!!errors.genre}
                  helperText={errors.genre?.message} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="ISBN" fullWidth
                  {...register("isbn")}
                  error={!!errors.isbn}
                  helperText={errors.isbn?.message} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Price (₹)" type="number" fullWidth
                  {...register("price")}
                  error={!!errors.price}
                  helperText={errors.price?.message} />
              </Grid>
              <Grid item xs={6}>
                <TextField label="Stock" type="number" fullWidth
                  {...register("stock")}
                  error={!!errors.stock}
                  helperText={errors.stock?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Image URL" fullWidth
                  {...register("imageUrl")}
                  error={!!errors.imageUrl}
                  helperText={errors.imageUrl?.message} />
              </Grid>
              <Grid item xs={12}>
                <TextField label="Description" fullWidth multiline rows={3}
                  {...register("description")}
                  error={!!errors.description}
                  helperText={errors.description?.message} />
              </Grid>
            </Grid>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={handleClose}>Cancel</Button>
          <Button type="submit" form="book-form"
            variant="contained" sx={{ borderRadius: 2 }}>
            {editingBook ? "Update Book" : "Create Book"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}>
        <DialogTitle>Delete Book?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this book?
            This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirm(null)}>Cancel</Button>
          <Button color="error" variant="contained"
            onClick={() => handleDelete(deleteConfirm)}
            sx={{ borderRadius: 2 }}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  )
}

export default AdminBooksPage