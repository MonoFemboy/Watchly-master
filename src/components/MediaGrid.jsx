import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import Card from './Card';
import {
  fetchTrending,
  fetchAllByGenre,
  searchTMDB,
  searchAnilist,
} from '../api';
import './MediaGrid.css';

const genresMap = {
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

const easeOut = [0.22, 0.1, 0.22, 1];

const MediaGrid = ({ type = 'movie' }) => {
  const reduceMotion = useReducedMotion();
  const [trending, setTrending] = useState([]);
  const [genreResults, setGenreResults] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const searchTimeout = useRef(null);
  const scrollRefs = useRef({});

  const heroMotion = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 10 },
        animate: { opacity: 1, y: 0 },
        transition: { duration: 0.45, ease: easeOut },
      };

  const rowMotion = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.08, margin: '0px 0px -32px 0px' },
        transition: { duration: 0.4, ease: easeOut },
      };

  useEffect(() => {
    setTrending([]);
    setGenreResults({});
    fetchTrending(type).then(setTrending);

    const genres = genresMap[type] || [];
    genres.forEach((genre) => {
      const idOrName = typeof genre === 'string' ? genre : genre.id;
      fetchAllByGenre(type, idOrName).then((data) => {
        setGenreResults((prev) => ({ ...prev, [idOrName]: data }));
      });
    });
  }, [type]);

  useEffect(() => {
    if (searchTimeout.current) clearTimeout(searchTimeout.current);
    if (!searchQuery) return setSearchResults([]);

    searchTimeout.current = setTimeout(async () => {
      const results =
        type === 'anime'
          ? await searchAnilist(searchQuery)
          : await searchTMDB(type, searchQuery);
      setSearchResults(results);
    }, 300);
  }, [searchQuery, type]);

  const scroll = (key, dir) => {
    const container = scrollRefs.current[key];
    if (container) {
      container.scrollBy({
        left: dir === 'left' ? -window.innerWidth * 0.8 : window.innerWidth * 0.8,
        behavior: 'smooth',
      });
    }
  };

  const typeLabel =
    type === 'tv' ? 'TV Shows' : type === 'anime' ? 'Anime' : 'Movies';

  const searchMotion = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        transition: { duration: 0.3, delay: 0.05, ease: easeOut },
      };

  return (
    <div className="media-grid-wrapper">
      <motion.div className="media-hero" {...heroMotion}>
        <h1 className="media-hero-title">Watchly</h1>
        <p className="media-hero-sub">Stream what you love. Save titles to My List with the star.</p>
      </motion.div>

      <motion.input
        className="search-bar"
        placeholder={`Search ${typeLabel.toLowerCase()}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search"
        {...searchMotion}
      />

      {searchQuery && (
        <motion.div className="section" {...rowMotion} key="search-section">
          <h2 className="row-title">Search results</h2>
          <button
            type="button"
            className="scroll-btn left"
            onClick={() => scroll('search', 'left')}
            aria-label="Scroll search results left"
          >
            ‹
          </button>
          <button
            type="button"
            className="scroll-btn right"
            onClick={() => scroll('search', 'right')}
            aria-label="Scroll search results right"
          >
            ›
          </button>
          <div className="scroll-container" ref={(el) => (scrollRefs.current['search'] = el)}>
            {searchResults.map((item) => (
              <Card key={item.id} item={item} type={type} />
            ))}
          </div>
        </motion.div>
      )}

      <motion.div className="section" {...rowMotion}>
        <h2 className="row-title">Trending</h2>
        <button
          type="button"
          className="scroll-btn left"
          onClick={() => scroll('trending', 'left')}
          aria-label="Scroll trending left"
        >
          ‹
        </button>
        <button
          type="button"
          className="scroll-btn right"
          onClick={() => scroll('trending', 'right')}
          aria-label="Scroll trending right"
        >
          ›
        </button>
        <div className="scroll-container" ref={(el) => (scrollRefs.current['trending'] = el)}>
          {trending.map((item) => (
            <Card key={item.id} item={item} type={type} />
          ))}
        </div>
      </motion.div>

      {(genresMap[type] || []).map((genre) => {
        const idOrName = typeof genre === 'string' ? genre : genre.id;
        const label = typeof genre === 'string' ? genre : genre.name;
        const results = genreResults[idOrName] || [];

        return (
          <motion.div className="section" key={idOrName} {...rowMotion}>
            <h2 className="row-title">{label}</h2>
            <button
              type="button"
              className="scroll-btn left"
              onClick={() => scroll(idOrName, 'left')}
              aria-label={`Scroll ${label} left`}
            >
              ‹
            </button>
            <button
              type="button"
              className="scroll-btn right"
              onClick={() => scroll(idOrName, 'right')}
              aria-label={`Scroll ${label} right`}
            >
              ›
            </button>
            <div className="scroll-container" ref={(el) => (scrollRefs.current[idOrName] = el)}>
              {results.map((item) => (
                <Card key={item.id} item={item} type={type} />
              ))}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default MediaGrid;
