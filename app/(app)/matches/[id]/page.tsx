import Link from "next/link";
import { notFound } from "next/navigation";
import Card from "@/components/ui/Card";
import GameIcon from "@/components/GameIcon";
import { createClient } from "@/lib/supabase/server";
import type { MatchEloChange, MatchWithDetails } from "@/lib/types/database";
import { cardClassName } from "@/lib/styles";

function getTeamPlayers(match: MatchWithDetails, team: 1 | 2): string {
  return match.match_players
    .filter((p) => p.team === team)
    .sort((a, b) => a.slot - b.slot)
    .map((p) => p.profiles.display_name)
    .join(" & ");
}

function formatEloDelta(delta: number): string {
  if (delta > 0) return `+${delta}`;
  return String(delta);
}

export default async function MatchDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  const [{ data: match }, { data: eloChanges }] = await Promise.all([
    supabase
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
      .single(),
    supabase.from("match_elo_changes").select("*").eq("match_id", id),
  ]);

  if (!match) notFound();

  const m = match as MatchWithDetails;
  const team1Won = m.team1_score > m.team2_score;
  const team2Won = m.team2_score > m.team1_score;
  const eloByUser = new Map(
    (eloChanges as MatchEloChange[] | null)?.map((c) => [c.user_id, c]) ?? []
  );

  return (
    <div className="space-y-6">
      <Link
        href="/matches"
        className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-amber-600 dark:text-amber-400"
      >
        ← Back to matches
      </Link>

      <header className="text-center">
        <span className="inline-flex items-center gap-2 rounded-full bg-zinc-100 px-4 py-1.5 text-sm font-semibold dark:bg-zinc-800">
          <GameIcon icon={m.game_types.icon} size={16} />
          {m.game_types.name}
        </span>
        <p className="mt-2 text-xs font-medium text-zinc-400">
          {new Date(m.played_at).toLocaleString()}
        </p>
      </header>

      <Card>
        <div className="space-y-6">
          <div className="text-center">
            <p
              className={`text-sm ${team1Won ? "font-semibold text-emerald-600 dark:text-emerald-400" : "text-zinc-500"}`}
            >
              Team 1 {team1Won && "· Winner"}
            </p>
            <p className="mt-1 text-lg">{getTeamPlayers(m, 1)}</p>
            <div className="mt-2 space-y-1">
              {m.match_players
                .filter((p) => p.team === 1)
                .sort((a, b) => a.slot - b.slot)
                .map((p) => {
                  const change = eloByUser.get(p.user_id);
                  if (!change) return null;
                  return (
                    <p
                      key={p.user_id}
                      className="text-xs font-mono text-zinc-500"
                    >
                      {p.profiles.display_name}: {change.rating_before} →{" "}
                      {change.rating_after}{" "}
                      <span
                        className={
                          change.rating_delta >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        ({formatEloDelta(change.rating_delta)})
                      </span>
                    </p>
                  );
                })}
            </div>
          </div>

          <div className="flex items-center justify-center gap-4 rounded-3xl bg-zinc-100 px-6 py-5 font-mono text-5xl font-bold dark:bg-zinc-800/80">
            <span
              className={
                team1Won ? "text-emerald-600 dark:text-emerald-400" : ""
              }
            >
              {m.team1_score}
            </span>
            <span className="text-zinc-300 dark:text-zinc-600">–</span>
            <span
              className={
                team2Won ? "text-emerald-600 dark:text-emerald-400" : ""
              }
            >
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
            <div className="mt-2 space-y-1">
              {m.match_players
                .filter((p) => p.team === 2)
                .sort((a, b) => a.slot - b.slot)
                .map((p) => {
                  const change = eloByUser.get(p.user_id);
                  if (!change) return null;
                  return (
                    <p
                      key={p.user_id}
                      className="text-xs font-mono text-zinc-500"
                    >
                      {p.profiles.display_name}: {change.rating_before} →{" "}
                      {change.rating_after}{" "}
                      <span
                        className={
                          change.rating_delta >= 0
                            ? "text-emerald-600 dark:text-emerald-400"
                            : "text-red-600 dark:text-red-400"
                        }
                      >
                        ({formatEloDelta(change.rating_delta)})
                      </span>
                    </p>
                  );
                })}
            </div>
          </div>
        </div>
      </Card>

      {m.notes && (
        <div className={`${cardClassName} text-sm`}>
          <p className="font-medium text-zinc-500">Notes</p>
          <p className="mt-1">{m.notes}</p>
        </div>
      )}
    </div>
  );
}
