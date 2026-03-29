import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchMediaDetails } from '../../services/api';
import { getVidSrcUrl, getVidEasyUrl } from '../../utils/providers';
import Player from '../player/Player';
import './WatchPage.css';

const WatchPage = () => {
  const { type, id, season, episode } = useParams();
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(Number(season) || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(Number(episode) || 1);
  const [episodeList, setEpisodeList] = useState([]);
  const [provider, setProvider] = useState('vidsrc');

  useEffect(() => {
    fetchMediaDetails(type, id).then((data) => {
      setMedia(data);

      if (type === 'tv' && data?.seasons?.length > 0) {
        const currentSeason = data.seasons.find(
          (s) => s.season_number === selectedSeason
        );
        if (currentSeason && currentSeason.episodes) {
          setEpisodeList(currentSeason.episodes);
        } else {
          const fallbackEpisodes = Array.from(
            { length: currentSeason?.episode_count || 1 },
            (_, i) => ({ episode_number: i + 1, name: '' })
          );
          setEpisodeList(fallbackEpisodes);
        }
      }
    });
  }, [type, id, selectedSeason]);

  const handleSeasonClick = (seasonNum) => {
    setSelectedSeason(seasonNum);
    setSelectedEpisode(1);
    navigate(`/watch/${type}/${id}/${seasonNum}/1`);
  };

  const handleEpisodeClick = (epNum) => {
    setSelectedEpisode(epNum);
    navigate(`/watch/${type}/${id}/${selectedSeason}/${epNum}`);
  };

  const title =
    media?.title?.romaji || media?.title || media?.name || 'Loading...';

  const videoSrc = useMemo(() => {
    if (provider === 'vidsrc') {
      return getVidSrcUrl({
        type,
        imdb: id.startsWith('tt') ? id : undefined,
        tmdb: !id.startsWith('tt') ? id : undefined,
        season: type === 'tv' ? selectedSeason : undefined,
        episode: type === 'tv' ? selectedEpisode : undefined,
        autoplay: true,
      });
    }
    if (provider === 'videasy') {
      return getVidEasyUrl({
        type,
        imdbId: id,
        season: type === 'tv' ? selectedSeason : undefined,
        episode: type === 'tv' ? selectedEpisode : undefined,
      });
    }
    return '';
  }, [provider, type, id, selectedSeason, selectedEpisode]);

  return (
    <div className="watch-page">
      <div className="watch-page__header">
        <h1 className="watch-page__title">{title}</h1>
        <div className="watch-page__providers" role="tablist" aria-label="Video source">
          <button
            type="button"
            role="tab"
            aria-selected={provider === 'vidsrc'}
            className={`watch-page__provider ${provider === 'vidsrc' ? 'active' : ''}`}
            onClick={() => setProvider('vidsrc')}
          >
            VidSrc
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={provider === 'videasy'}
            className={`watch-page__provider ${provider === 'videasy' ? 'active' : ''}`}
            onClick={() => setProvider('videasy')}
          >
            VidEasy
          </button>
        </div>
      </div>

      <Player src={videoSrc} />

      {(type === 'tv' || type === 'anime') && (
        <div className="watch-page__selectors">
          {media?.seasons?.length > 0 && (
            <div className="watch-page__group">
              <h2 className="watch-page__group-title">Season</h2>
              <div className="watch-page__chips">
                {media.seasons.map((s) => (
                  <button
                    key={s.season_number}
                    type="button"
                    className={`watch-page__chip ${
                      selectedSeason === s.season_number ? 'active' : ''
                    }`}
                    onClick={() => handleSeasonClick(s.season_number)}
                  >
                    {s.name || `Season ${s.season_number}`}
                  </button>
                ))}
              </div>
            </div>
          )}

          {episodeList.length > 0 && (
            <div className="watch-page__group">
              <h2 className="watch-page__group-title">Episode</h2>
              <div className="watch-page__chips">
                {episodeList.map((ep) => (
                  <button
                    key={ep.episode_number}
                    type="button"
                    className={`watch-page__chip ${
                      selectedEpisode === ep.episode_number ? 'active' : ''
                    }`}
                    onClick={() => handleEpisodeClick(ep.episode_number)}
                    title={ep.name || `Episode ${ep.episode_number}`}
                  >
                    Ep {ep.episode_number}
                    {ep.name && <span className="watch-page__ep-name"> — {ep.name}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default WatchPage;
