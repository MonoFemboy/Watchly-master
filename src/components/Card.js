import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { isInWatchlist, toggleWatchlistItem } from '../utils/watchlist';
import './Card.css';

const Card = ({ item, type }) => {
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);
  const [saved, setSaved] = useState(() => isInWatchlist(item, type));

  const title =
    item?.title?.romaji || item?.title || item?.name || item?.original_title || item?.original_name;

  const img = useMemo(() => {
    if (item?.poster_path) return `https://image.tmdb.org/t/p/w300${item.poster_path}`;
    if (item?.coverImage?.large) return item.coverImage.large;
    if (item?.backdrop_path) return `https://image.tmdb.org/t/p/w500${item.backdrop_path}`;
    return '';
  }, [item]);

  const ratioClass = useMemo(() => {
    return item?.backdrop_path && !item?.poster_path ? 'landscape' : 'portrait';
  }, [item]);

  useEffect(() => {
    setSaved(isInWatchlist(item, type));
  }, [item, type]);

  useEffect(() => {
    const onUpdate = () => setSaved(isInWatchlist(item, type));
    window.addEventListener('watchlist-updated', onUpdate);
    return () => window.removeEventListener('watchlist-updated', onUpdate);
  }, [item, type]);

  const handleWatchlistClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    toggleWatchlistItem(item, type);
    setSaved(isInWatchlist(item, type));
  };

  const handleClick = () => {
    navigate(`/details/${type}/${item.id}`);
  };

  return (
    <div
      className={`media-card card ${ratioClass} ${hovered ? 'is-hovered' : ''}`}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div className="card-thumbnail">
        {img ? (
          <img src={img} alt={title} loading="lazy" />
        ) : (
          <div className="img-fallback">{title?.[0] || '?'}</div>
        )}

        <div className="card-overlay">
          <div className="overlay-top">
            <button
              type="button"
              className="watchlist-btn overlay-btn"
              onClick={handleWatchlistClick}
              aria-label={saved ? 'Remove from My List' : 'Add to My List'}
            >
              {saved ? '★' : '☆'}
            </button>
          </div>
          <div className="overlay-bottom">
            <p className="overlay-title">{title}</p>
          </div>
        </div>
      </div>

      <div className="card-info">
        <button
          type="button"
          className="watchlist-btn card-star-mobile"
          onClick={handleWatchlistClick}
          aria-label={saved ? 'Remove from My List' : 'Add to My List'}
        >
          {saved ? '★' : '☆'}
        </button>
        <p className="card-title">{title}</p>
      </div>
    </div>
  );
};

export default Card;
