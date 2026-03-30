import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMediaDetails } from '../api';
import { isInWatchlist, toggleWatchlistItem } from '../utils/watchlist';
import './MediaDetailPage.css';

const MediaDetailPage = () => {
  const { type, id } = useParams();
  const navigate = useNavigate();
  const [media, setMedia] = useState(null);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    fetchMediaDetails(type, id).then(setMedia);
  }, [type, id]);

  useEffect(() => {
    if (!media) return;
    setSaved(isInWatchlist(media, type));
  }, [media, type]);

  useEffect(() => {
    const onUpdate = () => {
      if (media) setSaved(isInWatchlist(media, type));
    };
    window.addEventListener('watchlist-updated', onUpdate);
    return () => window.removeEventListener('watchlist-updated', onUpdate);
  }, [media, type]);

  if (!media) return <div className="media-detail">Loading...</div>;

  const title = media.title?.romaji || media.title || media.name;
  const img = media.coverImage?.large || `https://image.tmdb.org/t/p/w500${media.poster_path}`;
  const description = media.description || media.overview || 'No description available.';

  const handleWatchClick = () => {
    const defaultSeason = type === 'tv' ? 1 : undefined;
    const defaultEpisode = type === 'tv' || type === 'anime' ? 1 : undefined;
    navigate(`/watch/${type}/${id}${defaultSeason ? `/${defaultSeason}/${defaultEpisode}` : ''}`);
  };

  const handleListClick = (e) => {
    e.preventDefault();
    toggleWatchlistItem(media, type);
    setSaved(isInWatchlist(media, type));
  };

  const getAgeRating = (m) => {
    if (!m) return 'NR';
    if (m.adult === true) return '18+';
    if (m.ageRating) return m.ageRating;
    if (m.contentRating) return m.contentRating;
    if (m.rating) return m.rating;
    if (m.rated) return m.rated;
    return 'NR';
  };

  const rating = getAgeRating(media);

  return (
    <div className="media-detail">
      <h2 className="media-detail-title">{title}</h2>
      <div className="media-detail-content">
        <img src={img} alt={title} />
        <div className="media-meta">
          <p className="media-description" dangerouslySetInnerHTML={{ __html: description }} />
          <p className="media-rating">Age rating: {rating}</p>
          <div className="media-actions">
            <button type="button" className="watch-now-btn" onClick={handleWatchClick}>
              ▶ Watch now
            </button>
            <button type="button" className="my-list-detail-btn" onClick={handleListClick}>
              {saved ? '★ In My List' : '☆ My List'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaDetailPage;
