export const GENRES_BY_TYPE = {
  movie: [
    { id: 28, name: 'Action' },
    { id: 35, name: 'Comedy' },
    { id: 18, name: 'Drama' },
    { id: 27, name: 'Horror' },
    { id: 10749, name: 'Romance' },
    { id: 878, name: 'Sci-Fi' },
  ],
  tv: [
    { id: 10759, name: 'Action & Adventure' },
    { id: 35, name: 'Comedy' },
    { id: 80, name: 'Crime' },
    { id: 18, name: 'Drama' },
    { id: 10765, name: 'Sci-Fi & Fantasy' },
    { id: 10751, name: 'Family' },
  ],
  anime: [
    'Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 'Romance', 'Sci-Fi',
  ],
};

export const GENRE_PAGE_MAP = {
  movie: {
    Action: 28,
    Comedy: 35,
    Drama: 18,
    Fantasy: 14,
  },
  tv: {
    'Action & Adventure': 10759,
    Comedy: 35,
    Drama: 18,
    Animation: 16,
  },
};
