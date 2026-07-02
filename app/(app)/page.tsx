import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithDetails } from "@/lib/types/database";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: stats } = await supabase
    .from("player_stats")
    .select("*")
    .eq("user_id", user!.id)
    .maybeSingle();

  const { data: recentMatches } = await supabase
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
    .order("played_at", { ascending: false })
    .limit(5);

  const myStats = stats ?? {
    wins: 0,
    losses: 0,
    ties: 0,
    win_rate: 0,
    total_matches: 0,
  };

  return (
    <div className="space-y-8">
      <header>
        <p className="text-sm font-medium uppercase tracking-wider text-amber-600 dark:text-amber-400">
          JHV Olympics
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
      </header>

      <section className="rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 p-6 text-white shadow-lg">
        <p className="text-sm font-medium opacity-90">Your record</p>
        <p className="mt-1 font-mono text-4xl font-bold">
          {myStats.wins}-{myStats.losses}-{myStats.ties}
        </p>
        <p className="mt-2 text-sm opacity-90">
          {myStats.win_rate}% win rate · {myStats.total_matches} games
        </p>
        <Link
          href="/matches/new"
          className="mt-4 inline-flex min-h-11 items-center rounded-xl bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
        >
          Log a match →
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent matches</h2>
          <Link href="/matches" className="text-sm text-amber-600 dark:text-amber-400">
            View all
          </Link>
        </div>

        {(recentMatches as MatchWithDetails[] | null)?.length ? (
          <div className="space-y-3">
            {(recentMatches as MatchWithDetails[]).map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
            No matches yet. Be the first to log one!
          </p>
        )}
      </section>
    </div>
  );
}
