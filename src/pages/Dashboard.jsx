import React, { useState } from "react";
import { getStats, getTopWatched, resetStats } from "../utils/stats";
import "./Dashboard.css";

const ACCESS_KEY = "watchly_dashboard_unlocked_v1";

function isUnlocked() {
  return localStorage.getItem(ACCESS_KEY) === "1";
}

function unlock(code) {
  const expected = process.env.REACT_APP_DASHBOARD_CODE || "watchly";
  if (code === expected) {
    localStorage.setItem(ACCESS_KEY, "1");
    return true;
  }
  return false;
}

export default function Dashboard() {
  const [unlocked, setUnlocked] = useState(() => {
    try {
      return isUnlocked();
    } catch {
      return false;
    }
  });
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [, setRefresh] = useState(0);

  let stats = null;
  try {
    stats = getStats();
  } catch {
    stats = null;
  }
  const topMovies = getTopWatched({ type: "movie", limit: 8 });
  const topShows = getTopWatched({ type: "tv", limit: 8 });

  if (!unlocked) {
    return (
      <div className="dashboard-page">
        <div className="dashboard-card">
          <h1 className="dashboard-title">Dashboard</h1>
          <p className="dashboard-sub">
            Enter access code to view stats.
          </p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setError("");
              try {
                const ok = unlock(code);
                if (ok) {
                  setUnlocked(true);
                } else {
                  setError("Invalid access code.");
                }
              } catch {
                setError("Unable to unlock on this device.");
              }
            }}
          >
            <input
              className="dashboard-input"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="Access code"
              aria-label="Access code"
              type="password"
            />
            <button className="dashboard-btn primary" type="submit">
              Unlock
            </button>
          </form>
          {error ? <div className="dashboard-error">{error}</div> : null}
          <div className="dashboard-hint">
            Set a custom code with <code>REACT_APP_DASHBOARD_CODE</code>.
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page">
      <div className="dashboard-header">
        <h1 className="dashboard-title">Dashboard</h1>
        <div className="dashboard-actions">
          <button
            className="dashboard-btn"
            type="button"
            onClick={() => {
              localStorage.removeItem(ACCESS_KEY);
              setUnlocked(false);
            }}
          >
            Lock
          </button>
          <button
            className="dashboard-btn danger"
            type="button"
            onClick={() => {
              resetStats();
              setRefresh((n) => n + 1);
            }}
          >
            Reset stats
          </button>
          <button
            className="dashboard-btn"
            type="button"
            onClick={() => setRefresh((n) => n + 1)}
          >
            Refresh
          </button>
        </div>
      </div>

      {!stats ? (
        <div className="dashboard-card">Stats unavailable on this device.</div>
      ) : (
        <>
          <div className="dashboard-grid">
            <div className="dashboard-card">
              <div className="metric-label">Website visits (this device)</div>
              <div className="metric-value">{stats.visits}</div>
            </div>
            <div className="dashboard-card">
              <div className="metric-label">Watch starts (total)</div>
              <div className="metric-value">{stats.watchStarts.total}</div>
              <div className="metric-sub">
                Movies: {stats.watchStarts.movie} · Shows: {stats.watchStarts.tv} · Anime:{" "}
                {stats.watchStarts.anime}
              </div>
            </div>
            <div className="dashboard-card">
              <div className="metric-label">Last watch start</div>
              <div className="metric-value small">{stats.lastWatchAt || "—"}</div>
            </div>
          </div>

          <div className="dashboard-split">
            <div className="dashboard-card">
              <h2 className="section-title">Most watched movies</h2>
              {topMovies.length === 0 ? (
                <div className="empty">No data yet.</div>
              ) : (
                <ol className="top-list">
                  {topMovies.map((x) => (
                    <li key={x.id} className="top-item">
                      <span className="top-title">{x.title || `Movie ${x.id}`}</span>
                      <span className="top-count">{x.count}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
            <div className="dashboard-card">
              <h2 className="section-title">Most watched shows</h2>
              {topShows.length === 0 ? (
                <div className="empty">No data yet.</div>
              ) : (
                <ol className="top-list">
                  {topShows.map((x) => (
                    <li key={x.id} className="top-item">
                      <span className="top-title">{x.title || `Show ${x.id}`}</span>
                      <span className="top-count">{x.count}</span>
                    </li>
                  ))}
                </ol>
              )}
            </div>
          </div>

          <div className="dashboard-footnote">
            Stats are stored locally in your browser (per-device), not on a server.
          </div>
        </>
      )}
    </div>
  );
}

