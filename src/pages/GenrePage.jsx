import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchAllByGenre, fetchAnimeByGenre } from '../services/api';
import { GENRE_PAGE_MAP } from '../constants/genres';
import Card from '../components/media/Card';
import './SecondaryPage.css';

const GenrePage = () => {
  const { genreName } = useParams();
  const [items, setItems] = useState([]);
  const [type, setType] = useState('movie');

  useEffect(() => {
    const fetchData = async () => {
      setItems([]);
      if (type === 'anime') {
        const anime = await fetchAnimeByGenre(genreName);
        setItems(anime);
        return;
      }
      const map = GENRE_PAGE_MAP[type];
      const genreId = map?.[genreName];
      if (genreId != null) {
        const result = await fetchAllByGenre(type, genreId);
        setItems(result);
      }
    };

    fetchData();
  }, [genreName, type]);

  const decodedName = decodeURIComponent(genreName || '');

  return (
    <div className="secondary-page">
      <Link to="/" className="secondary-page__back">
        ← Back to home
      </Link>
      <h1 className="secondary-page__title">{decodedName}</h1>

      <div className="secondary-page__tabs" role="tablist" aria-label="Browse type">
        {['movie', 'tv', 'anime'].map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={type === t}
            className={`secondary-page__tab ${type === t ? 'active' : ''}`}
            onClick={() => setType(t)}
          >
            {t === 'movie' ? 'Movies' : t === 'tv' ? 'TV Shows' : 'Anime'}
          </button>
        ))}
      </div>

      <div className="secondary-page__grid">
        {items.map((item) => (
          <Card key={`${item.id}-genre`} item={item} type={type} />
        ))}
      </div>
    </div>
  );
};

export default GenrePage;
