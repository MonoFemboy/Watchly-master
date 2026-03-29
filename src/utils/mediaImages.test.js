import { getDisplayTitle, getHeroBackdropUrl } from './mediaImages';

describe('mediaImages', () => {
  test('getDisplayTitle prefers romaji', () => {
    expect(getDisplayTitle({ title: { romaji: 'Cowboy Bebop' } })).toBe('Cowboy Bebop');
  });

  test('getHeroBackdropUrl uses backdrop_path', () => {
    expect(
      getHeroBackdropUrl({ backdrop_path: '/x.jpg' })
    ).toContain('/w1280/x.jpg');
  });
});
