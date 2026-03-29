import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMediaDetails } from '../../services/api';
import { isInWatchlist, toggleWatchlistItem } from '../../utils/watchlist';
import { getHeroBackdropUrl } from '../../utils/mediaImages';
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

  if (!media) {
    return (
      <div className="media-detail media-detail--loading">
        <p className="media-detail__loading">Loading…</p>
      </div>
    );
  }

  const title = media.title?.romaji || media.title || media.name;
  const poster =
    media.coverImage?.large || `https://image.tmdb.org/t/p/w500${media.poster_path}`;
  const backdrop = getHeroBackdropUrl(media);
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
    <article className="media-detail">
      <div className="media-detail__hero" aria-hidden={!backdrop}>
        {backdrop ? (
          <img src={backdrop} alt="" className="media-detail__hero-img" />
        ) : null}
        <div className="media-detail__hero-scrim" />
      </div>

      <div className="media-detail__body">
        <div className="media-detail__main">
          <img className="media-detail__poster" src={poster} alt={title} />
          <div className="media-detail__copy">
            <h1 className="media-detail__title">{title}</h1>
            <p className="media-detail__meta">
              <span className="media-detail__badge">{rating}</span>
            </p>
            <div
              className="media-detail__description"
              dangerouslySetInnerHTML={{ __html: description }}
            />
            <div className="media-detail__actions">
              <button type="button" className="media-detail__btn media-detail__btn--play" onClick={handleWatchClick}>
                ▶ Play
              </button>
              <button type="button" className="media-detail__btn media-detail__btn--list" onClick={handleListClick}>
                {saved ? '★ In My List' : '☆ My List'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
};

export default MediaDetailPage;
