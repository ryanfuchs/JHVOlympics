import Link from "next/link";
import type { MatchWithDetails } from "@/lib/types/database";

function getTeamPlayers(
  match: MatchWithDetails,
  team: 1 | 2
): string {
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
      className="block rounded-2xl border border-zinc-200 bg-white p-4 shadow-sm transition-shadow hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="text-sm font-medium text-zinc-500 dark:text-zinc-400">
          {match.game_types.icon} {match.game_types.name}
        </span>
        <span className="text-xs text-zinc-400">{formatDate(match.played_at)}</span>
      </div>

      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3">
        <div className={`text-right ${team1Won ? "font-semibold" : ""}`}>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {getTeamPlayers(match, 1)}
          </p>
        </div>

        <div className="flex items-center gap-2 font-mono text-2xl font-bold tracking-tight">
          <span className={team1Won ? "text-emerald-600 dark:text-emerald-400" : ""}>
            {match.team1_score}
          </span>
          <span className="text-zinc-300 dark:text-zinc-600">–</span>
          <span className={team2Won ? "text-emerald-600 dark:text-emerald-400" : ""}>
            {match.team2_score}
          </span>
        </div>

        <div className={`${team2Won ? "font-semibold" : ""}`}>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            {getTeamPlayers(match, 2)}
          </p>
        </div>
      </div>

      {isTie && (
        <p className="mt-2 text-center text-xs font-medium text-amber-600 dark:text-amber-400">
          Tie game
        </p>
      )}
    </Link>
  );
}
