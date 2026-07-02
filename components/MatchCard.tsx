import Link from "next/link";
import GameIcon from "@/components/GameIcon";
import type { MatchWithDetails } from "@/lib/types/database";
import {
  cardClassName,
  gradientBadge,
  gradientScoreBox,
} from "@/lib/styles";

function getTeamPlayers(match: MatchWithDetails, team: 1 | 2): string {
  return match.match_players
    .filter((p) => p.team === team)
    .sort((a, b) => a.slot - b.slot)
    .map((p) => p.profiles.display_name)
    .join(" & ");
}

function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function MatchCard({ match }: { match: MatchWithDetails }) {
  const team1Won = match.team1_score > match.team2_score;
  const team2Won = match.team2_score > match.team1_score;
  const isTie = match.team1_score === match.team2_score;

  return (
    <Link
      href={`/matches/${match.id}`}
      className={`${cardClassName} group relative block overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-orange-950/10 active:scale-[0.99] dark:hover:shadow-orange-950/5`}
    >
      <div className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-orange-400/15 blur-2xl transition-opacity group-hover:opacity-100 opacity-60" />

      <div className="relative mb-4 flex items-center justify-between gap-2">
        <span
          className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold text-zinc-800 dark:text-zinc-100 ${gradientBadge}`}
        >
          <GameIcon icon={match.game_types.icon} size={14} />
          {match.game_types.name}
        </span>
        <span className="text-xs font-medium text-zinc-400">
          {formatDate(match.played_at)}
        </span>
      </div>

      <div className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className={`text-right ${team1Won ? "font-semibold" : ""}`}>
          <p className="text-sm leading-snug text-zinc-600 dark:text-zinc-300">
            {getTeamPlayers(match, 1)}
          </p>
        </div>

        <div
          className={`flex min-w-[5.5rem] items-center justify-center gap-1.5 rounded-2xl px-3 py-2 font-mono text-2xl font-bold tracking-tight ${gradientScoreBox}`}
        >
          <span
            className={
              team1Won
                ? "text-orange-700 dark:text-orange-400"
                : "text-stone-700 dark:text-stone-200"
            }
          >
            {match.team1_score}
          </span>
          <span className="text-base font-normal text-zinc-300 dark:text-zinc-600">
            –
          </span>
          <span
            className={
              team2Won
                ? "text-orange-700 dark:text-orange-400"
                : "text-stone-700 dark:text-stone-200"
            }
          >
            {match.team2_score}
          </span>
        </div>

        <div className={team2Won ? "font-semibold" : ""}>
          <p className="text-sm leading-snug text-zinc-600 dark:text-zinc-300">
            {getTeamPlayers(match, 2)}
          </p>
        </div>
      </div>

      {isTie && (
        <p className="relative mt-3 text-center text-xs font-semibold uppercase tracking-wider text-zinc-500">
          Tie
        </p>
      )}
    </Link>
  );
}
