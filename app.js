const express = require('express');
const movies = require('./movies.json');
const crypto = require('node:crypto');
const cors = require('cors');
const { validateMovie, validateParcialMovie } = require('./Schemas/movies');
const app = express();
app.use(express.json());
app.use(cors());
app.disable('x-powered-by');

app.get('/', (req, res) => {
  res.json({ message: 'Hola Mundo' });
});

app.get('/movies', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  const { genre } = req.query;
  if (genre) {
    const filterMovies = movies.filter((movie) =>
      movie.genre.some((g) => g.toLowerCase() === genre.toLocaleLowerCase())
    );
    return res.send(filterMovies);
  }
  res.json(movies);
});

app.get('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movie = movies.find((movie) => movie.id === id);
  if (movie) return res.json(movie);
  res.status(404).json({ message: 'Movie not found' });
});
app.post('/movies', (req, res) => {
  const result = validateMovie(req.body);
  if (result.error) {
    return res.status(400).json({ error: JSON.parse(result.error.message) });
  }
  const newMovie = {
    id: crypto.randomUUID(),
    ...result.data,
  };
  movies.push(newMovie);
  res.status(201).json(newMovie);
});
app.delete('/movies/:id', (req, res) => {
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex === -1) {
    return res.status(404).json({ messge: 'movie not found' });
  }
  movies.splice(movieIndex, 1);
  return res.json({ message: 'Movie deleted' });
});

app.patch('/movies/:id', (req, res) => {
  const result = validateParcialMovie(req.body);
  if (!result.success) {
    return res.status(404).json({ error: JSON.parse(result.error.message) });
  }
  const { id } = req.params;
  const movieIndex = movies.findIndex((movie) => movie.id === id);
  if (movieIndex < 0) {
    return res.status(404).json({ message: 'Movie not found' });
  }
  const updateMovie = {
    ...movies[movieIndex],
    ...result.data,
  };
  movies[movieIndex] = updateMovie;
  return res.json(updateMovie);
});
app.use('/movies', (req, res) => {
  res.status(404);
});

app.options('/movies/:id', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-control-Allow-Methods', 'GET, POST,PATCH,DELETE');
  res.send(200);
});
const PORT = process.env.PORT ?? 1234;
app.listen(PORT, () => {
  console.log(`Server listening on port http://localhost:${PORT}`);
});
