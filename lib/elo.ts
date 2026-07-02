/**
 * Standard ELO expected score for team vs team (2v2 uses team-average ratings).
 */
export function expectedScore(ratingA: number, ratingB: number): number {
  return 1 / (1 + Math.pow(10, (ratingB - ratingA) / 400));
}

/**
 * ELO rating change after a match result.
 * @param rating Current player/team rating
 * @param opponentRating Opponent team average rating
 * @param score Actual result: 1 win, 0.5 tie, 0 loss
 * @param k K-factor (default 32)
 */
export function eloDelta(
  rating: number,
  opponentRating: number,
  score: number,
  k = 32
): number {
  const expected = expectedScore(rating, opponentRating);
  return Math.round(k * (score - expected));
}

export const DEFAULT_ELO = 1000;
export const ELO_K_FACTOR = 32;
