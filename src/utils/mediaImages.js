export function getHeroBackdropUrl(item, size = 'w1280') {
  if (!item) return '';
  if (item.backdrop_path) return `https://image.tmdb.org/t/p/${size}${item.backdrop_path}`;
  if (item.poster_path) return `https://image.tmdb.org/t/p/${size}${item.poster_path}`;
  if (item.coverImage?.large) return item.coverImage.large;
  return '';
}

export function getDisplayTitle(item) {
  return (
    item?.title?.romaji ||
    item?.title ||
    item?.name ||
    item?.original_title ||
    item?.original_name ||
    ''
  );
}

export function getOverviewSnippet(item, maxLen = 220) {
  const raw = item?.overview || item?.description || '';
  const stripped = String(raw).replace(/<[^>]+>/g, '').trim();
  if (stripped.length <= maxLen) return stripped;
  return `${stripped.slice(0, maxLen).trim()}…`;
}
