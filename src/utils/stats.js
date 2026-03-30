const STATS_KEY = "watchly_stats_v1";

function nowIso() {
  return new Date().toISOString();
}

function safeParse(json, fallback) {
  try {
    return JSON.parse(json);
  } catch {
    return fallback;
  }
}

function defaultStats() {
  return {
    createdAt: nowIso(),
    visits: 0,
    watchStarts: {
      total: 0,
      movie: 0,
      tv: 0,
      anime: 0,
    },
    items: {
      movie: {},
      tv: {},
      anime: {},
    },
    lastWatchAt: null,
  };
}

export function getStats() {
  const raw = localStorage.getItem(STATS_KEY);
  return safeParse(raw, null) || defaultStats();
}

export function setStats(next) {
  localStorage.setItem(STATS_KEY, JSON.stringify(next));
}

export function recordVisit() {
  const s = getStats();
  s.visits += 1;
  setStats(s);
}

export function recordWatchStart({ type, id, title }) {
  const mediaType = type || "movie";
  const s = getStats();

  s.watchStarts.total += 1;
  if (s.watchStarts[mediaType] !== undefined) s.watchStarts[mediaType] += 1;

  if (!s.items[mediaType]) s.items[mediaType] = {};
  const key = String(id);
  const prev = s.items[mediaType][key] || { id: key, title: title || "", count: 0, lastAt: null };
  s.items[mediaType][key] = {
    id: key,
    title: title || prev.title || "",
    count: (prev.count || 0) + 1,
    lastAt: nowIso(),
  };

  s.lastWatchAt = nowIso();
  setStats(s);
}

export function getTopWatched({ type, limit = 10 }) {
  const s = getStats();
  const bucket = s.items?.[type] || {};
  return Object.values(bucket)
    .sort((a, b) => (b.count || 0) - (a.count || 0))
    .slice(0, limit);
}

export function resetStats() {
  setStats(defaultStats());
}

