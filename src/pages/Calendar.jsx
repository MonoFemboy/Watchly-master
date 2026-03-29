import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { fetchAiringTodayTV } from '../services/api';
import './SecondaryPage.css';

const Calendar = () => {
  const [airing, setAiring] = useState([]);

  useEffect(() => {
    const load = async () => {
      const data = await fetchAiringTodayTV();
      setAiring(data);
    };
    load();
  }, []);

  return (
    <div className="secondary-page">
      <Link to="/" className="secondary-page__back">
        ← Back to home
      </Link>
      <h1 className="secondary-page__title">TV airing today</h1>

      {airing.length === 0 ? (
        <p className="secondary-page__empty">No shows airing today.</p>
      ) : (
        <div className="secondary-page__air-grid">
          {airing.map((show) => (
            <article key={show.id} className="secondary-page__air-card">
              <img
                src={`https://image.tmdb.org/t/p/w342${show.poster_path}`}
                alt={show.name || ''}
                className="secondary-page__air-poster"
              />
              <div className="secondary-page__air-name">{show.name}</div>
              {show.next_episode_to_air && (
                <div className="secondary-page__air-ep">
                  S{show.next_episode_to_air.season_number}E{show.next_episode_to_air.episode_number}
                  {show.next_episode_to_air.name ? ` — ${show.next_episode_to_air.name}` : ''}
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
};

export default Calendar;
