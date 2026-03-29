import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/media/Card';
import './SecondaryPage.css';

const WatchHistory = () => {
  const [history, setHistory] = useState([]);
  const [filter, setFilter] = useState('all');
  const navigate = useNavigate();

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem('watchHistory') || '{}');
    const values = Object.values(saved).sort((a, b) => b.updatedAt - a.updatedAt);
    setHistory(values);
  }, []);

  const handleRemove = (id) => {
    const current = JSON.parse(localStorage.getItem('watchHistory') || '{}');
    delete current[id];
    localStorage.setItem('watchHistory', JSON.stringify(current));
    setHistory(Object.values(current).sort((a, b) => b.updatedAt - a.updatedAt));
  };

  const filtered =
    filter === 'all' ? history : history.filter((item) => item.type === filter);

  return (
    <div className="secondary-page">
      <Link to="/" className="secondary-page__back">
        ← Back to home
      </Link>
      <h1 className="secondary-page__title">Continue watching</h1>

      <div className="secondary-page__tabs" role="tablist" aria-label="Filter history">
        {['all', 'movie', 'tv', 'anime'].map((t) => (
          <button
            key={t}
            type="button"
            role="tab"
            aria-selected={filter === t}
            className={`secondary-page__tab ${filter === t ? 'active' : ''}`}
            onClick={() => setFilter(t)}
          >
            {t === 'all' ? 'All' : t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="secondary-page__empty">No watch history yet. Playback progress is saved from the embedded player when available.</p>
      ) : (
        <div className="secondary-page__grid">
          {filtered.map((item) => (
            <div key={`${item.type}-${item.id}`} className="secondary-page__history-item">
              <Card item={item} type={item.type} />
              <div className="secondary-page__history-actions">
                <button
                  type="button"
                  className="secondary-page__btn secondary-page__btn--primary"
                  onClick={() => navigate(`/watch/${item.type}/${item.id}`)}
                >
                  Resume
                </button>
                <button
                  type="button"
                  className="secondary-page__btn secondary-page__btn--ghost"
                  onClick={() => handleRemove(item.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WatchHistory;
