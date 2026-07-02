"use client";

import LeaderboardTable, {
  type LeaderboardRow,
} from "@/components/LeaderboardTable";
import PageHeader from "@/components/ui/PageHeader";
import SegmentControl from "@/components/ui/SegmentControl";
import type {
  GameType,
  PlayerEloByGame,
  PlayerEloOverall,
  PlayerStats,
  PlayerStatsByGame,
} from "@/lib/types/database";
import { chipActiveClassName, chipClassName, chipInactiveClassName } from "@/lib/styles";
import { useMemo, useState } from "react";

type LeaderboardClientProps = {
  overallStats: PlayerStats[];
  statsByGame: PlayerStatsByGame[];
  eloOverall: PlayerEloOverall[];
  eloByGame: PlayerEloByGame[];
  gameTypes: GameType[];
  currentUserId: string;
};

function buildOverallRows(
  stats: PlayerStats[],
  eloOverall: PlayerEloOverall[]
): LeaderboardRow[] {
  const eloMap = new Map(eloOverall.map((e) => [e.user_id, e.rating]));

  return stats
    .filter((s) => s.total_matches > 0)
    .map((s) => ({
      user_id: s.user_id,
      display_name: s.display_name,
      wins: s.wins,
      losses: s.losses,
      ties: s.ties,
      win_rate: s.win_rate,
      total_matches: s.total_matches,
      rating: eloMap.get(s.user_id) ?? null,
    }));
}

function buildGameRows(
  statsByGame: PlayerStatsByGame[],
  eloByGame: PlayerEloByGame[],
  gameTypeId: string
): LeaderboardRow[] {
  const gameStats = statsByGame.filter((s) => s.game_type_id === gameTypeId);
  const eloMap = new Map(
    eloByGame
      .filter((e) => e.game_type_id === gameTypeId)
      .map((e) => [e.user_id, e.rating])
  );

  return gameStats.map((s) => ({
    user_id: s.user_id,
    display_name: s.display_name,
    wins: s.wins,
    losses: s.losses,
    ties: s.ties,
    win_rate: s.win_rate,
    total_matches: s.total_matches,
    rating: eloMap.get(s.user_id) ?? null,
  }));
}

export default function LeaderboardClient({
  overallStats,
  statsByGame,
  eloOverall,
  eloByGame,
  gameTypes,
  currentUserId,
}: LeaderboardClientProps) {
  const [selectedGame, setSelectedGame] = useState<string>("overall");
  const [sortBy, setSortBy] = useState<"elo" | "wins">("elo");

  const displayedRows = useMemo(() => {
    if (selectedGame === "overall") {
      return buildOverallRows(overallStats, eloOverall);
    }
    return buildGameRows(statsByGame, eloByGame, selectedGame);
  }, [selectedGame, overallStats, statsByGame, eloOverall, eloByGame]);

  const gamesWithStats = gameTypes.filter((gt) =>
    statsByGame.some((s) => s.game_type_id === gt.id)
  );

  return (
    <div className="space-y-5">
      <PageHeader
        title="Leaderboard"
        description="ELO ratings and win records"
      />

      <SegmentControl
        options={[
          { value: "elo" as const, label: "By ELO" },
          { value: "wins" as const, label: "By wins" },
        ]}
        value={sortBy}
        onChange={setSortBy}
      />

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <button
          type="button"
          onClick={() => setSelectedGame("overall")}
          className={`${chipClassName} ${
            selectedGame === "overall" ? chipActiveClassName : chipInactiveClassName
          }`}
        >
          Overall
        </button>
        {gamesWithStats.map((gt) => (
          <button
            key={gt.id}
            type="button"
            onClick={() => setSelectedGame(gt.id)}
            className={`${chipClassName} ${
              selectedGame === gt.id ? chipActiveClassName : chipInactiveClassName
            }`}
          >
            {gt.icon} {gt.name}
          </button>
        ))}
      </div>

      <LeaderboardTable
        rows={displayedRows}
        highlightUserId={currentUserId}
        sortBy={sortBy}
      />
    </div>
  );
}
