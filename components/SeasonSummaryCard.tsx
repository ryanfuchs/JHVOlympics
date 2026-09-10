import Link from "next/link";
import { Trophy } from "lucide-react";
import {
  daysLeftInSeason,
  formatSeasonKey,
  seasonProgress,
} from "@/lib/seasons";
import { cardClassName, surfaceMuted, textAccent } from "@/lib/styles";
import type { SeasonStanding } from "@/lib/types/database";

type SeasonSummaryCardProps = {
  seasonKey: string;
  standings: SeasonStanding[];
  currentUserId: string;
};

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

export default function SeasonSummaryCard({
  seasonKey,
  standings,
  currentUserId,
}: SeasonSummaryCardProps) {
  const ranked = [...standings].sort((a, b) => a.rank - b.rank);
  const leader = ranked.find((row) => row.qualified);
  const mine = ranked.find((row) => row.user_id === currentUserId);
  const daysLeft = daysLeftInSeason(seasonKey);
  const progress = Math.round(seasonProgress(seasonKey) * 100);

  return (
    <Link href="/leaderboard/seasons" className={`block ${cardClassName}`}>
      <div className="flex items-center justify-between gap-3">
        <span className="flex items-center gap-2 text-sm font-bold tracking-tight text-stone-900 dark:text-stone-50">
          <Trophy size={16} className={textAccent} aria-hidden />
          Season {formatSeasonKey(seasonKey)}
        </span>
        <span className="shrink-0 text-xs font-medium text-stone-500 dark:text-stone-400">
          {daysLeft} {daysLeft === 1 ? "day" : "days"} left
        </span>
      </div>

      <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-stone-200/80 dark:bg-stone-700/60">
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-orange-700"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
        <div className={`rounded-2xl px-3 py-2.5 ${surfaceMuted}`}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            Leading
          </p>
          <p className="mt-0.5 truncate font-semibold text-stone-900 dark:text-stone-50">
            {leader ? leader.display_name : "—"}
          </p>
          <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
            {leader ? `${formatDelta(leader.elo_delta)} ELO` : "no games yet"}
          </p>
        </div>
        <div className={`rounded-2xl px-3 py-2.5 ${surfaceMuted}`}>
          <p className="text-[11px] font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400">
            You
          </p>
          <p className="mt-0.5 font-semibold text-stone-900 dark:text-stone-50">
            {mine?.qualified ? `#${mine.rank}` : "Unranked"}
          </p>
          <p className="font-mono text-xs text-stone-500 dark:text-stone-400">
            {mine
              ? `${formatDelta(mine.elo_delta)} ELO · ${mine.matches} games`
              : "no games yet"}
          </p>
        </div>
      </div>
    </Link>
  );
}
