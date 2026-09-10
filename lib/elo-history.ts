import { DEFAULT_ELO } from "@/lib/elo";

export type EloChangeRow = {
  user_id: string;
  rating_after: number;
  matches: { played_at: string; game_type_id: string } | null;
  profiles: { display_name: string } | null;
};

export type EloHistoryPlayer = {
  userId: string;
  name: string;
  color: string;
};

export type EloHistoryPoint = {
  date: string;
  timestamp: number;
  [playerName: string]: string | number;
};

const PLAYER_COLORS = [
  "#c2410c",
  "#9a3412",
  "#ea580c",
  "#7c2d12",
  "#b45309",
  "#78350f",
  "#d97706",
  "#451a03",
];

type ValidChange = EloChangeRow & {
  matches: { played_at: string; game_type_id: string };
  profiles: { display_name: string };
};

type GameRating = { rating: number; games: number };

/**
 * Weighted by games played, matching the `player_elo_overall` view. A flat
 * average let a single lucky match in one game type count as much as fifty in
 * another.
 */
function computeOverallRating(gameRatings: Map<string, GameRating>): number {
  let weighted = 0;
  let games = 0;
  for (const entry of gameRatings.values()) {
    weighted += entry.rating * entry.games;
    games += entry.games;
  }
  return games > 0 ? Math.round(weighted / games) : DEFAULT_ELO;
}

function formatChartDate(iso: string): string {
  return new Date(iso).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
  });
}

export function buildEloHistory(changes: EloChangeRow[]) {
  const sorted = changes
    .filter(
      (row): row is ValidChange => row.matches != null && row.profiles != null
    )
    .sort(
      (a, b) =>
        new Date(a.matches.played_at).getTime() -
        new Date(b.matches.played_at).getTime()
    );

  const userGameRatings = new Map<string, Map<string, GameRating>>();
  const userNames = new Map<string, string>();
  const events: Array<{
    userId: string;
    timestamp: number;
    playedAt: string;
    rating: number;
  }> = [];

  for (const row of sorted) {
    userNames.set(row.user_id, row.profiles.display_name);

    if (!userGameRatings.has(row.user_id)) {
      userGameRatings.set(row.user_id, new Map());
    }

    const gameRatings = userGameRatings.get(row.user_id)!;
    const gameTypeId = row.matches.game_type_id;
    gameRatings.set(gameTypeId, {
      rating: row.rating_after,
      games: (gameRatings.get(gameTypeId)?.games ?? 0) + 1,
    });

    events.push({
      userId: row.user_id,
      timestamp: new Date(row.matches.played_at).getTime(),
      playedAt: row.matches.played_at,
      rating: computeOverallRating(gameRatings),
    });
  }

  const players: EloHistoryPlayer[] = [...userNames.entries()]
    .map(([userId, name], index) => ({
      userId,
      name,
      color: PLAYER_COLORS[index % PLAYER_COLORS.length],
    }))
    .sort((a, b) => a.name.localeCompare(b.name));

  const timestamps = [...new Set(events.map((e) => e.timestamp))].sort(
    (a, b) => a - b
  );

  const lastKnown = new Map<string, number>();
  const chartData: EloHistoryPoint[] = timestamps.map((timestamp) => {
    for (const event of events.filter((e) => e.timestamp === timestamp)) {
      lastKnown.set(event.userId, event.rating);
    }

    const sample = events.find((e) => e.timestamp === timestamp)!;
    const point: EloHistoryPoint = {
      date: formatChartDate(sample.playedAt),
      timestamp,
    };

    for (const player of players) {
      const rating = lastKnown.get(player.userId);
      if (rating != null) {
        point[player.name] = rating;
      }
    }

    return point;
  });

  return { players, chartData, hasData: events.length > 0 };
}

export { DEFAULT_ELO };
