import React, { useEffect, useState, useRef } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import {
  fetchTrending,
  fetchAllByGenre,
  searchTMDB,
  searchAnilist,
} from '../../services/api';
import { GENRES_BY_TYPE } from '../../constants/genres';
import { EASE_OUT } from '../../constants/motion';
import HeroBanner from './HeroBanner';
import MediaRow from './MediaRow';
import './HomePage.css';

const HomePage = ({ type = 'movie' }) => {
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
        transition: { duration: 0.45, ease: EASE_OUT },
      };

  const rowMotion = reduceMotion
    ? { initial: false }
    : {
        initial: { opacity: 0, y: 14 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, amount: 0.08, margin: '0px 0px -32px 0px' },
        transition: { duration: 0.4, ease: EASE_OUT },
      };

  useEffect(() => {
    setTrending([]);
    setGenreResults({});
    fetchTrending(type).then(setTrending);

    const genres = GENRES_BY_TYPE[type] || [];
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
        transition: { duration: 0.3, delay: 0.05, ease: EASE_OUT },
      };

  const featured = trending[0] || null;

  return (
    <div className="home-page">
      <HeroBanner featured={featured} type={type} typeLabel={typeLabel} />

      <motion.p className="home-page__tagline" {...heroMotion}>
        Stream what you love. Save titles to My List with the star on any poster.
      </motion.p>

      <motion.input
        className="home-page__search"
        placeholder={`Search ${typeLabel.toLowerCase()}...`}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        aria-label="Search"
        {...searchMotion}
      />

      {searchQuery && (
        <MediaRow
          title="Search results"
          rowKey="search"
          items={searchResults}
          type={type}
          scrollRefs={scrollRefs}
          onScroll={scroll}
          rowMotion={rowMotion}
        />
      )}

      <MediaRow
        title="Trending"
        rowKey="trending"
        items={trending}
        type={type}
        scrollRefs={scrollRefs}
        onScroll={scroll}
        rowMotion={rowMotion}
      />

      {(GENRES_BY_TYPE[type] || []).map((genre) => {
        const idOrName = typeof genre === 'string' ? genre : genre.id;
        const label = typeof genre === 'string' ? genre : genre.name;
        const results = genreResults[idOrName] || [];

        return (
          <MediaRow
            key={idOrName}
            title={label}
            rowKey={idOrName}
            items={results}
            type={type}
            scrollRefs={scrollRefs}
            onScroll={scroll}
            rowMotion={rowMotion}
          />
        );
      })}
    </div>
  );
};

export default HomePage;
