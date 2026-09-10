/** Seasons are calendar quarters, keyed as `2026-Q3` so they sort chronologically. */

const QUARTER_LABELS = ["Jan – Mar", "Apr – Jun", "Jul – Sep", "Oct – Dec"];

export type SeasonKey = string;

export function seasonKeyFor(date: Date): SeasonKey {
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `${date.getFullYear()}-Q${quarter}`;
}

export function parseSeasonKey(key: SeasonKey): { year: number; quarter: number } {
  const [year, quarter] = key.split("-Q");
  return { year: Number(year), quarter: Number(quarter) };
}

/** "Q3 2026" */
export function formatSeasonKey(key: SeasonKey): string {
  const { year, quarter } = parseSeasonKey(key);
  return `Q${quarter} ${year}`;
}

/** "Jul – Sep 2026" */
export function formatSeasonRange(key: SeasonKey): string {
  const { year, quarter } = parseSeasonKey(key);
  return `${QUARTER_LABELS[quarter - 1]} ${year}`;
}

export function seasonBounds(key: SeasonKey): { start: Date; end: Date } {
  const { year, quarter } = parseSeasonKey(key);
  const start = new Date(year, (quarter - 1) * 3, 1);
  const end = new Date(year, quarter * 3, 1);
  return { start, end };
}

/** Whole days left in the season, floored at 0. */
export function daysLeftInSeason(key: SeasonKey, now: Date = new Date()): number {
  const { end } = seasonBounds(key);
  return Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86_400_000));
}

/** 0–1 through the season, for the progress bar. */
export function seasonProgress(key: SeasonKey, now: Date = new Date()): number {
  const { start, end } = seasonBounds(key);
  const span = end.getTime() - start.getTime();
  const elapsed = now.getTime() - start.getTime();
  return Math.min(1, Math.max(0, elapsed / span));
}

/**
 * Every season key from the first one with matches through the current one,
 * newest first — so quiet quarters still show up instead of silently vanishing.
 */
export function seasonKeyRange(
  earliest: SeasonKey,
  current: SeasonKey
): SeasonKey[] {
  const from = parseSeasonKey(earliest);
  const to = parseSeasonKey(current);
  const keys: SeasonKey[] = [];

  let { year, quarter } = from;
  while (year < to.year || (year === to.year && quarter <= to.quarter)) {
    keys.push(`${year}-Q${quarter}`);
    quarter += 1;
    if (quarter > 4) {
      quarter = 1;
      year += 1;
    }
  }

  return keys.reverse();
}
