import Link from "next/link";
import type { MatchWithDetails } from "@/lib/types/database";
import { cardClassName } from "@/lib/styles";

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
      className={`${cardClassName} block transition-all hover:-translate-y-0.5 hover:shadow-xl active:scale-[0.99]`}
    >
      <div className="mb-4 flex items-center justify-between gap-2">
        <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-3 py-1 text-xs font-semibold text-zinc-700 dark:bg-zinc-800 dark:text-zinc-200">
          <span>{match.game_types.icon}</span>
          {match.game_types.name}
        </span>
        <span className="text-xs font-medium text-zinc-400">
          {formatDate(match.played_at)}
        </span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className={`text-right ${team1Won ? "font-semibold" : ""}`}>
          <p className="text-sm leading-snug text-zinc-600 dark:text-zinc-300">
            {getTeamPlayers(match, 1)}
          </p>
        </div>

        <div className="flex min-w-[5.5rem] items-center justify-center gap-1.5 rounded-2xl bg-zinc-100 px-3 py-2 font-mono text-2xl font-bold tracking-tight dark:bg-zinc-800/80">
          <span
            className={
              team1Won ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-200"
            }
          >
            {match.team1_score}
          </span>
          <span className="text-base font-normal text-zinc-300 dark:text-zinc-600">
            –
          </span>
          <span
            className={
              team2Won ? "text-emerald-600 dark:text-emerald-400" : "text-zinc-700 dark:text-zinc-200"
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
        <p className="mt-3 text-center text-xs font-semibold uppercase tracking-wider text-amber-600 dark:text-amber-400">
          Tie game
        </p>
      )}
    </Link>
  );
}
