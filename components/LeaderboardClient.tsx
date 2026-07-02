"use client";

import LeaderboardTable from "@/components/LeaderboardTable";
import type { GameType, PlayerStats, PlayerStatsByGame } from "@/lib/types/database";
import { useMemo, useState } from "react";

type LeaderboardClientProps = {
  overallStats: PlayerStats[];
  statsByGame: PlayerStatsByGame[];
  gameTypes: GameType[];
  currentUserId: string;
};

export default function LeaderboardClient({
  overallStats,
  statsByGame,
  gameTypes,
  currentUserId,
}: LeaderboardClientProps) {
  const [selectedGame, setSelectedGame] = useState<string>("overall");

  const displayedStats = useMemo(() => {
    if (selectedGame === "overall") {
      return overallStats.filter((s) => s.total_matches > 0);
    }
    return statsByGame
      .filter((s) => s.game_type_id === selectedGame)
      .map((s) => ({
        user_id: s.user_id,
        display_name: s.display_name,
        total_matches: s.total_matches,
        wins: s.wins,
        losses: s.losses,
        ties: s.ties,
        win_rate: s.win_rate,
      }));
  }, [selectedGame, overallStats, statsByGame]);

  const gamesWithStats = gameTypes.filter((gt) =>
    statsByGame.some((s) => s.game_type_id === gt.id)
  );

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Leaderboard</h1>
        <p className="mt-1 text-zinc-500">Rankings and win rates</p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          type="button"
          onClick={() => setSelectedGame("overall")}
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
            selectedGame === "overall"
              ? "bg-amber-500 text-white"
              : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
          }`}
        >
          Overall
        </button>
        {gamesWithStats.map((gt) => (
          <button
            key={gt.id}
            type="button"
            onClick={() => setSelectedGame(gt.id)}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition-colors ${
              selectedGame === gt.id
                ? "bg-amber-500 text-white"
                : "bg-zinc-100 text-zinc-600 dark:bg-zinc-800 dark:text-zinc-300"
            }`}
          >
            {gt.icon} {gt.name}
          </button>
        ))}
      </div>

      <LeaderboardTable stats={displayedStats} highlightUserId={currentUserId} />
    </div>
  );
}
