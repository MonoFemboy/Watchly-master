// src/components/WatchPage.jsx
import React, { useEffect, useState, useMemo, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchMediaDetails, fetchSimilarMedia } from "../api";
import { recordWatchStart } from "../utils/stats";
import { getVidSrcUrl, getVidEasyUrl } from "../utils/providers";
import Player from "./Player";
import Card from "./Card";
import "./WatchPage.css";

const WatchPage = () => {
  const { type, id, season, episode } = useParams();
  const navigate = useNavigate();

  const [media, setMedia] = useState(null);
  const [selectedSeason, setSelectedSeason] = useState(Number(season) || 1);
  const [selectedEpisode, setSelectedEpisode] = useState(Number(episode) || 1);
  const [episodeList, setEpisodeList] = useState([]);
  const [provider, setProvider] = useState("vidsrc");
  const [similar, setSimilar] = useState([]);
  const similarScrollRef = useRef(null);

  // Fetch media details
  useEffect(() => {
    fetchMediaDetails(type, id).then((data) => {
      setMedia(data);

      if (type === "tv" && data?.seasons?.length > 0) {
        const currentSeason = data.seasons.find(
          (s) => s.season_number === selectedSeason
        );
        if (currentSeason && currentSeason.episodes) {
          setEpisodeList(currentSeason.episodes);
        } else {
          const fallbackEpisodes = Array.from(
            { length: currentSeason?.episode_count || 1 },
            (_, i) => ({ episode_number: i + 1, name: "" })
          );
          setEpisodeList(fallbackEpisodes);
        }
      }
    });
  }, [type, id, selectedSeason]);

  useEffect(() => {
    let cancelled = false;
    fetchSimilarMedia(type, id)
      .then((items) => {
        if (!cancelled) setSimilar(items || []);
      })
      .catch(() => {
        if (!cancelled) setSimilar([]);
      });
    return () => {
      cancelled = true;
    };
  }, [type, id]);

  const scrollSimilar = (dir) => {
    const el = similarScrollRef.current;
    if (!el) return;
    el.scrollBy({
      left: dir === "left" ? -window.innerWidth * 0.8 : window.innerWidth * 0.8,
      behavior: "smooth",
    });
  };

  // Handle season change
  const handleSeasonClick = (seasonNum) => {
    setSelectedSeason(seasonNum);
    setSelectedEpisode(1);
    navigate(`/watch/${type}/${id}/${seasonNum}/1`);
  };

  // Handle episode change
  const handleEpisodeClick = (epNum) => {
    setSelectedEpisode(epNum);
    navigate(`/watch/${type}/${id}/${selectedSeason}/${epNum}`);
  };

  const title =
    media?.title?.romaji || media?.title || media?.name || "Loading...";

  useEffect(() => {
    if (!media) return;
    try {
      recordWatchStart({ type, id, title });
    } catch {
      // ignore stats errors (private mode / storage blocked)
    }
  }, [type, id, title, media]);

  // Memoize video URL to recalc when dependencies change
  const videoSrc = useMemo(() => {
    if (provider === "vidsrc") {
      return getVidSrcUrl({
        type,
        imdb: id.startsWith("tt") ? id : undefined,
        tmdb: !id.startsWith("tt") ? id : undefined,
        season: type === "tv" ? selectedSeason : undefined,
        episode: type === "tv" ? selectedEpisode : undefined,
        autoplay: true,
      });
    } else if (provider === "videasy") {
      return getVidEasyUrl({
        type,
        imdbId: id,
        season: type === "tv" ? selectedSeason : undefined,
        episode: type === "tv" ? selectedEpisode : undefined,
      });
    }
    return "";
  }, [provider, type, id, selectedSeason, selectedEpisode]);

  return (
    <div className="watch-page">
      <div className="watch-header">
        <h2 className="watch-title">{title}</h2>
        <p className="watch-subtitle">Choose a provider, then press play.</p>
      </div>

      {/* Provider Switcher */}
      <div className="provider-switcher">
        <button
          className={provider === "vidsrc" ? "active" : ""}
          onClick={() => setProvider("vidsrc")}
        >
          VidSrc
        </button>
        <button
          className={provider === "videasy" ? "active" : ""}
          onClick={() => setProvider("videasy")}
        >
          VidEasy
        </button>
      </div>

      {/* Video Player */}
      <Player src={videoSrc} />

      {/* Season & Episode Selectors */}
      {(type === "tv" || type === "anime") && (
        <div className="selectors-wrapper">
          {media?.seasons?.length > 0 && (
            <div className="selector-group horizontal">
              <h3>Season</h3>
              <div className="selector-container horizontal-scroll">
                {media.seasons.map((s) => (
                  <button
                    key={s.season_number}
                    className={`selector-btn ${
                      selectedSeason === s.season_number ? "active" : ""
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
            <div className="selector-group horizontal">
              <h3>Episode</h3>
              <div className="selector-container horizontal-scroll">
                {episodeList.map((ep) => (
                  <button
                    key={ep.episode_number}
                    className={`selector-btn ${
                      selectedEpisode === ep.episode_number ? "active" : ""
                    }`}
                    onClick={() => handleEpisodeClick(ep.episode_number)}
                    title={ep.name || `Episode ${ep.episode_number}`}
                  >
                    Ep {ep.episode_number}
                    {ep.name && <span className="ep-name"> — {ep.name}</span>}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {type !== "anime" && similar.length > 0 && (
        <div className="watch-recs">
          <h3 className="watch-recs-title">Recommended for you</h3>
          <button
            type="button"
            className="scroll-btn left"
            onClick={() => scrollSimilar("left")}
            aria-label="Scroll recommendations left"
          >
            ‹
          </button>
          <button
            type="button"
            className="scroll-btn right"
            onClick={() => scrollSimilar("right")}
            aria-label="Scroll recommendations right"
          >
            ›
          </button>
          <div className="scroll-container" ref={similarScrollRef}>
            {similar.map((item) => (
              <Card key={item.id} item={item} type={type} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WatchPage;
