import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithDetails } from "@/lib/types/database";

function getTeamPlayers(match: MatchWithDetails, team: 1 | 2): string {
  return match.match_players
    .filter((p) => p.team === team)
    .sort((a, b) => a.slot - b.slot)
    .map((p) => p.profiles.display_name)
    .join(" & ");
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: match } = await supabase
    .from("matches")
    .select(
      `
      *,
      game_types (*),
      match_players (
        *,
        profiles (*)
      )
    `
    )
    .eq("id", id)
    .single();

  if (!match) notFound();

  const m = match as MatchWithDetails;
  const team1Won = m.team1_score > m.team2_score;
  const team2Won = m.team2_score > m.team1_score;

  return (
    <div className="space-y-6">
      <Link
        href="/matches"
        className="inline-flex min-h-11 items-center text-sm text-amber-600 dark:text-amber-400"
      >
        ← Back to matches
      </Link>

      <header className="text-center">
        <p className="text-sm font-medium text-zinc-500">
          {m.game_types.icon} {m.game_types.name}
        </p>
        <p className="mt-1 text-xs text-zinc-400">
          {new Date(m.played_at).toLocaleString()}
        </p>
      </header>

      <div className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="space-y-6">
          <div className="text-center">
            <p
              className={`text-sm ${team1Won ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}`}
            >
              Team 1 {team1Won && "· Winner"}
            </p>
            <p className="mt-1 text-lg">{getTeamPlayers(m, 1)}</p>
          </div>

          <div className="flex items-center justify-center gap-4 font-mono text-5xl font-bold">
            <span className={team1Won ? "text-emerald-600 dark:text-emerald-400" : ""}>
              {m.team1_score}
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">–</span>
            <span className={team2Won ? "text-emerald-600 dark:text-emerald-400" : ""}>
              {m.team2_score}
            </span>
          </div>

          <div className="text-center">
            <p
              className={`text-sm ${team2Won ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}`}
            >
              Team 2 {team2Won && "· Winner"}
            </p>
            <p className="mt-1 text-lg">{getTeamPlayers(m, 2)}</p>
          </div>
        </div>
      </div>

      {m.notes && (
        <div className="rounded-xl bg-zinc-50 p-4 text-sm dark:bg-zinc-900">
          <p className="font-medium text-zinc-500">Notes</p>
          <p className="mt-1">{m.notes}</p>
        </div>
      )}
    </div>
  );
}
