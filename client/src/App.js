import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { 
  ThemeProvider, CssBaseline, createTheme, useMediaQuery,
  AppBar, Toolbar, Typography, Container, TextField, Button, Grid, Card, CardContent, CardMedia,
  Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Select, MenuItem, InputLabel, FormControl,
  List, ListItem, ListItemText, Divider
} from '@mui/material';
import { Brightness4, Brightness7 } from '@mui/icons-material';

function App() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBook, setSelectedBook] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [openLoginDialog, setOpenLoginDialog] = useState(false);
  const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
  const [openRentDialog, setOpenRentDialog] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState('');
  const [user, setUser] = useState(null);
  const [rentalPrice, setRentalPrice] = useState('');
  const [rentalDuration, setRentalDuration] = useState('');
  const [priceRange] = useState([0, 100]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [rentedBooks, setRentedBooks] = useState([]);
  const [openRentedBooksDialog, setOpenRentedBooksDialog] = useState(false);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [recommendedBooks, setRecommendedBooks] = useState([]);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');

  useEffect(() => {
    setDarkMode(prefersDarkMode);
  }, [prefersDarkMode]);

  const theme = React.useMemo(
    () =>
      createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      }),
    [darkMode],
  );

  const searchGoogleBooks = useCallback(async (query) => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get(`http://localhost:5000/api/search?query=${query}`);
      setBooks(response.data);
    } catch (error) {
      console.error('Error searching Google Books:', error);
      setError('Failed to search books. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const fetchRentableBooks = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await axios.get('http://localhost:5000/api/books', {
        params: {
          query: searchQuery,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          category: selectedCategory,
        }
      });
      setBooks(response.data);
    } catch (error) {
      console.error('Error fetching rentable books:', error);
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, priceRange, selectedCategory]);

  const fetchRentedBooks = useCallback(async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:5000/api/rentals/${user.id}`);
        setRentedBooks(response.data);
      } catch (error) {
        console.error('Error fetching rented books:', error);
      }
    }
  }, [user]);

  const fetchRecommendations = useCallback(async () => {
    if (user) {
      try {
        const response = await axios.get(`http://localhost:5000/api/recommendations/${user.id}`);
        setRecommendedBooks(response.data);
      } catch (error) {
        console.error('Error fetching recommendations:', error);
      }
    }
  }, [user]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/categories');
        setCategories(response.data);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      if (user.userType === 'user') {
        fetchRentableBooks();
        fetchRecommendations();
      }
      fetchRentedBooks();
    }
  }, [isLoggedIn, user, fetchRentableBooks, fetchRentedBooks, fetchRecommendations]);  

  const handleSearch = (event) => {
    const value = event.target.value;
    setSearchQuery(value);
    if (isLoggedIn) {
      if (user.userType === 'renter') {
        searchGoogleBooks(value);
      } else {
        fetchRentableBooks();
      }
    }
  };

  const handleBookSelect = (book) => {
    setSelectedBook(book);
    setOpenRentDialog(true);
  };

  const handleAddBookForRent = async () => {
    if (selectedBook && user && rentalPrice && rentalDuration && selectedCategory) {
      try {
        const bookToAdd = {
          googleBooksId: selectedBook.id,
          title: selectedBook.title || selectedBook.volumeInfo.title,
          authors: selectedBook.authors || (selectedBook.volumeInfo.authors ? selectedBook.volumeInfo.authors.join(', ') : 'Unknown'),
          description: selectedBook.description || selectedBook.volumeInfo.description,
          imageUrl: selectedBook.imageUrl || selectedBook.volumeInfo.imageLinks?.thumbnail,
          renterId: user.id,
          rentalPrice: parseFloat(rentalPrice),
          rentalDuration: parseInt(rentalDuration),
          categoryId: selectedCategory,
        };
        const response = await axios.post('http://localhost:5000/api/books', bookToAdd);
        if (response.status === 201) {
          setSelectedBook(null);
          setSearchQuery('');
          setRentalPrice('');
          setRentalDuration('');
          setOpenRentDialog(false);
          fetchRentableBooks();
        } else {
          throw new Error('Failed to add book');
        }
      } catch (error) {
        console.error('Error adding book for rent:', error);
        setError('Failed to add book for rent. Please try again.');
      }
    } else {
      setError('Please fill in all required fields.');
    }
  };

  const handleRentBook = async () => {
    if (selectedBook && user) {
      try {
        const rental = {
          bookId: selectedBook.id,
          userId: user.id,
          rentalDate: new Date().toISOString(),
          returnDate: new Date(Date.now() + selectedBook.rentalDuration * 24 * 60 * 60 * 1000).toISOString(),
        };
        await axios.post('http://localhost:5000/api/rentals', rental);
        setSelectedBook(null);
        setOpenRentDialog(false);
        fetchRentedBooks();
        fetchRecommendations();
      } catch (error) {
        console.error('Error renting book:', error);
        setError('Failed to rent book. Please try again.');
      }
    }
  };

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', { username, password });
      setUser(response.data);
      setIsLoggedIn(true);
      setOpenLoginDialog(false);
    } catch (error) {
      alert('Invalid credentials');
    }
  };

  const handleRegister = async () => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', { username, password, userType });
      setUser(response.data);
      setIsLoggedIn(true);
      setOpenRegisterDialog(false);
    } catch (error) {
      alert('Registration failed');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUser(null);
    setBooks([]);
    setRentedBooks([]);
    setRecommendedBooks([]);
  };

  const handleCategoryChange = (event) => {
    setSelectedCategory(event.target.value);
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            Book Rental App
          </Typography>
          <FormControlLabel
            control={<Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />}
            label={darkMode ? <Brightness7 /> : <Brightness4 />}
          />
          {isLoggedIn ? (
            <>
              <Typography variant="subtitle1" style={{ marginRight: '1rem' }}>
                Welcome, {user.username} ({user.userType})
              </Typography>
              <Button color="inherit" onClick={() => setOpenRentedBooksDialog(true)}>My Rentals</Button>
              <Button color="inherit" onClick={handleLogout}>Logout</Button>
            </>
          ) : (
            <>
              <Button color="inherit" onClick={() => setOpenLoginDialog(true)}>Login</Button>
              <Button color="inherit" onClick={() => setOpenRegisterDialog(true)}>Register</Button>
            </>
          )}
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '2rem' }}>
        {isLoggedIn && user.userType === 'user' && (
          <div style={{ marginBottom: '2rem' }}>
            <Typography variant="h5" gutterBottom>Recommended Books</Typography>
            <Grid container spacing={3}>
              {recommendedBooks.map((book) => (
                <Grid item xs={12} sm={6} md={4} key={book.id}>
                  <Card 
                    style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
                    onClick={() => handleBookSelect(book)}
                  >
                    <CardMedia
                      component="img"
                      height="200"
                      image={book.imageUrl}
                      alt={book.title}
                      style={{ objectFit: 'contain' }}
                    />
                    <CardContent style={{ flexGrow: 1 }}>
                      <Typography gutterBottom variant="h5" component="div">
                        {book.title}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {book.authors}
                      </Typography>
                      <Typography variant="body1" color="primary">
                        Rental Price: ${book.rentalPrice}/day
                      </Typography>
                      <Typography variant="body1" color="primary">
                        Rental Duration: {book.rentalDuration} days
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        Category: {book.categoryName}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </div>
        )}
        <TextField
          fullWidth
          label="Search Books"
          variant="outlined"
          value={searchQuery}
          onChange={handleSearch}
          style={{ marginBottom: '1rem' }}
        />
        <FormControl fullWidth style={{ marginBottom: '1rem' }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={selectedCategory}
            onChange={handleCategoryChange}
          >
            <MenuItem value="">All Categories</MenuItem>
            {categories.map((category) => (
              <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
            ))}
          </Select>
        </FormControl>
        {isLoading && <Typography>Loading...</Typography>}
        {error && <Typography color="error">{error}</Typography>}
        <Grid container spacing={3}>
          {books.map((book) => (
            <Grid item xs={12} sm={6} md={4} key={book.id}>
              <Card 
                style={{ display: 'flex', flexDirection: 'column', height: '100%', cursor: 'pointer' }}
                onClick={() => handleBookSelect(book)}
              >
                <CardMedia
                  component="img"
                  height="200"
                  image={book.imageUrl}
                  alt={book.title}
                  style={{ objectFit: 'contain' }}
                />
                <CardContent style={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h5" component="div">
                    {book.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {book.authors}
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Rental Price: ${book.rentalPrice}/day
                  </Typography>
                  <Typography variant="body1" color="primary">
                    Rental Duration: {book.rentalDuration} days
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Category: {book.categoryName}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
      <Dialog open={openLoginDialog} onClose={() => setOpenLoginDialog(false)}>
        <DialogTitle>Login</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenLoginDialog(false)}>Cancel</Button>
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openRegisterDialog} onClose={() => setOpenRegisterDialog(false)}>
        <DialogTitle>Register</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Username"
            type="text"
            fullWidth
            variant="standard"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <TextField
            margin="dense"
            label="Password"
            type="password"
            fullWidth
            variant="standard"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>User Type</InputLabel>
            <Select
              value={userType}
              onChange={(e) => setUserType(e.target.value)}
            >
              <MenuItem value="user">User</MenuItem>
              <MenuItem value="renter">Renter</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRegisterDialog(false)}>Cancel</Button>
          <Button onClick={handleRegister}>Register</Button>
        </DialogActions>
      </Dialog>
      <Dialog open={openRentDialog} onClose={() => setOpenRentDialog(false)}>
        <DialogTitle>{user?.userType === 'renter' ? 'Add Book for Rent' : 'Rent Book'}</DialogTitle>
        <DialogContent>
          <Typography variant="h6">{selectedBook?.title}</Typography>
          {user?.userType === 'renter' ? (
            <>
              <TextField
                autoFocus
                margin="dense"
                label="Rental Price"
                type="number"
                fullWidth
                variant="standard"
                value={rentalPrice}
                onChange={(e) => setRentalPrice(e.target.value)}
              />
              <TextField
                margin="dense"
                label="Rental Duration (days)"
                type="number"
                fullWidth
                variant="standard"
                value={rentalDuration}
                onChange={(e) => setRentalDuration(e.target.value)}
              />
              <FormControl fullWidth margin="dense">
                <InputLabel>Category</InputLabel>
                <Select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                >
                  {categories.map((category) => (
                    <MenuItem key={category.id} value={category.id}>{category.name}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <Typography>
              Rental Price: ${selectedBook?.rentalPrice}/day
              <br />
              Rental Duration: {selectedBook?.rentalDuration} days
              <br />
              Category: {selectedBook?.categoryName}
            </Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRentDialog(false)}>Cancel</Button>
          {user?.userType === 'renter' ? (
            <Button onClick={handleAddBookForRent} disabled={!rentalPrice || !rentalDuration || !selectedCategory}>Add for Rent</Button>
          ) : (
            <Button onClick={handleRentBook}>Rent Book</Button>
          )}
        </DialogActions>
      </Dialog>
      <Dialog open={openRentedBooksDialog} onClose={() => setOpenRentedBooksDialog(false)}>
        <DialogTitle>My Rented Books</DialogTitle>
        <DialogContent>
          <List>
            {rentedBooks.map((rental, index) => (
              <React.Fragment key={rental.id}>
                <ListItem>
                  <ListItemText
                    primary={rental.title}
                    secondary={
                      <>
                        {`Rented on: ${new Date(rental.rentalDate).toLocaleDateString()} | Return by: ${new Date(rental.returnDate).toLocaleDateString()}`}
                        <br />
                        {`Category: ${rental.categoryName}`}
                      </>
                    }
                  />
                </ListItem>
                {index < rentedBooks.length - 1 && <Divider />}
              </React.Fragment>
            ))}
          </List>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenRentedBooksDialog(false)}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}

export default App;