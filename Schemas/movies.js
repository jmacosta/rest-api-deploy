const z = require('zod');
const movieSchema = z.object({
  title: z.string({
    invalid_type_error: 'Movie title must be a string.',
    required_error: 'Movie title is required.',
  }),
  genre: z

    .enum([
      'Action',
      'Adventure',
      'Fantasy',
      'Crime',
      'Drama',
      'Biography',
      'Romance',
      'Sci-Fi',
      'Animation',
    ])
    .array(),
  year: z.number().int().min(1900).max(2024),
  director: z.string({
    invalid_type_error: 'Movie director must be a string.',
    required_error: 'Movie director is required.',
  }),
  duration: z.number().int().positive(),
  rate: z.number().min(0).max(10).default(0),
  poster: z.string().url({ message: 'Poster must be a valid URL' }),
});

function validateMovie(object) {
  return movieSchema.safeParse(object);
}

function validateParcialMovie(object) {
  return movieSchema.partial().safeParse(object);
}

module.exports = {
  validateMovie,
  validateParcialMovie,
};
