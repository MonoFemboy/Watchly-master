import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();

  const browseType = useMemo(() => {
    if (location.pathname !== '/') return null;
    const q = new URLSearchParams(location.search);
    return q.get('type') || 'movie';
  }, [location.pathname, location.search]);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const navClass = (kind) => {
    if (location.pathname === '/my-list') {
      return kind === 'list' ? 'nav-link active' : 'nav-link';
    }
    if (location.pathname === '/calendar') {
      return kind === 'calendar' ? 'nav-link active' : 'nav-link';
    }
    if (location.pathname === '/history') {
      return kind === 'history' ? 'nav-link active' : 'nav-link';
    }
    if (location.pathname !== '/') {
      return 'nav-link';
    }
    if (kind === 'home') {
      return !location.search ? 'nav-link active' : 'nav-link';
    }
    if (kind === 'movie') {
      return browseType === 'movie' ? 'nav-link active' : 'nav-link';
    }
    if (kind === 'tv') {
      return browseType === 'tv' ? 'nav-link active' : 'nav-link';
    }
    if (kind === 'anime') {
      return browseType === 'anime' ? 'nav-link active' : 'nav-link';
    }
    return 'nav-link';
  };

  return (
    <header className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-inner">
        <Link to="/" className="logo">
          Watchly
        </Link>
        <nav className="nav-links" aria-label="Main">
          <Link to="/" className={navClass('home')}>
            Home
          </Link>
          <Link to="/?type=movie" className={navClass('movie')}>
            Movies
          </Link>
          <Link to="/?type=tv" className={navClass('tv')}>
            TV Shows
          </Link>
          <Link to="/?type=anime" className={navClass('anime')}>
            Anime
          </Link>
          <Link to="/my-list" className={navClass('list')}>
            My List
          </Link>
          <Link to="/calendar" className={navClass('calendar')}>
            Airing today
          </Link>
          <Link to="/history" className={navClass('history')}>
            Continue watching
          </Link>
        </nav>
      </div>
    </header>
  );
}
