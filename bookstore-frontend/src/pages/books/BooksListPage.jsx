import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { fetchBooks } from "../../features/books/bookSlice"
import BookCard from "../../components/books/BookCard"
import BookFilter from "../../components/books/BookFilter"
import BookSearch from "../../components/books/BookSearch"
import {
  Box, Grid, Typography, CircularProgress, Pagination
} from "@mui/material"

const BooksListPage = () => {
  const dispatch = useDispatch()
  const { books, isLoading, total, pages } = useSelector((state) => state.books)

  const [search, setSearch] = useState("")
  const [genre, setGenre] = useState("All")
  const [priceRange, setPriceRange] = useState([0, 2000])
  const [page, setPage] = useState(1)

  useEffect(() => {
    const params = { page, limit: 10 }
    if (search) params.search = search
    if (genre && genre !== "All") params.genre = genre
    dispatch(fetchBooks(params))
  }, [dispatch, search, genre, page])

  return (
    <Box sx={{ bgcolor: "#f0f2f5", minHeight: "100vh", width: "100%" }}>

      {/* ── Page Header — light style ── */}
      <Box sx={{
        bgcolor: "#fff",
        borderBottom: "1px solid #e8e8e8",
        px: { xs: 2, md: 4 },
        py: 1 ,
      }}>
        <Typography variant="h5" fontWeight="800" color="#1a1a2e">
          Browse Books
        </Typography>
        <Typography variant="caption" color="text.secondary" mt={0.5}>
          {total} books available
        </Typography>
      </Box>

      {/* ── Search Bar ── */}
      <Box sx={{ px: { xs: 2, md: 4 }, pt: 1, pb: 1 }}>
        <Box sx={{ maxWidth: 600, }}>
          <BookSearch
            value={search}
            onChange={(val) => { setSearch(val); setPage(1) }}
            onClear={() => { setSearch(""); setPage(1) }}
          />
        </Box>
      </Box>
      {/* ── Main Layout ── */}
      <Box sx={{
        display: "flex",
        gap: 2,
        px: { xs: 2, md: 4 },
        py: 1,
        alignItems: "flex-start",
      }}>

        {/* ── LEFT: Filter Sidebar ── */}
        <Box sx={{ width: 200, flexShrink: 0 }}>
          <BookFilter
            selectedGenre={genre}
            onGenreChange={(g) => { setGenre(g); setPage(1) }}
            priceRange={priceRange}
            onPriceChange={setPriceRange}
          />
        </Box>

        {/* ── RIGHT: Books Grid ── */}
        <Box sx={{ flex: 1, minWidth: 0 }}>
          {isLoading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
              <CircularProgress />
            </Box>
          ) : books.length === 0 ? (
            <Box sx={{
              textAlign: "center", py: 10,
              bgcolor: "#fff", borderRadius: 2,
            }}>
              <Typography variant="h6" color="text.secondary">
                No books found
              </Typography>
              <Typography variant="body2" color="text.secondary" mt={1}>
                Try a different search or filter
              </Typography>
            </Box>
          ) : (
            <>

              <Grid container spacing={2.5}>
                {books.map((book) => (
                  <Grid item xs={12} sm={6} md={6} lg={4} key={book._id}>
                    <BookCard book={book} />
                  </Grid>
                ))}
              </Grid>

              {pages > 1 && (
                <Box sx={{ display: "flex", justifyContent: "center", mt: 4 }}>
                  <Pagination
                    count={pages}
                    page={page}
                    onChange={(_, val) => setPage(val)}
                    color="primary"
                    shape="rounded"
                  />
                </Box>
              )}
            </>
          )}


        </Box>

      </Box>
    </Box>
  )
}

export default BooksListPage