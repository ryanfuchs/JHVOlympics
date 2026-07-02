import Link from "next/link";
import MatchCard from "@/components/MatchCard";
import PageHeader from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithDetails } from "@/lib/types/database";
import { cardClassName } from "@/lib/styles";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: stats }, { data: eloOverall }, { data: recentMatches }] =
    await Promise.all([
      supabase
        .from("player_stats")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle(),
      supabase
        .from("player_elo_overall")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle(),
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
        .order("played_at", { ascending: false })
        .limit(5),
    ]);

  const myStats = stats ?? {
    wins: 0,
    losses: 0,
    ties: 0,
    win_rate: 0,
    total_matches: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader eyebrow="JHV Olympics" title="Dashboard" />

      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-amber-500 via-amber-600 to-orange-600 p-6 text-white shadow-xl shadow-amber-600/25">
        <p className="text-xs font-bold uppercase tracking-wider opacity-80">
          Your record
        </p>
        <p className="mt-2 font-mono text-5xl font-bold tracking-tight">
          {myStats.wins}-{myStats.losses}-{myStats.ties}
        </p>
        <div className="mt-3 flex flex-wrap gap-3 text-sm opacity-90">
          <span className="rounded-full bg-white/15 px-3 py-1">
            {myStats.win_rate}% win rate
          </span>
          <span className="rounded-full bg-white/15 px-3 py-1">
            {myStats.total_matches} games
          </span>
          {eloOverall?.rating != null && (
            <span className="rounded-full bg-white/15 px-3 py-1">
              {eloOverall.rating} ELO
            </span>
          )}
        </div>
        <Link
          href="/matches/new"
          className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-white/20 px-5 py-2.5 text-sm font-semibold backdrop-blur transition-colors hover:bg-white/30"
        >
          Log a match →
        </Link>
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight">Recent matches</h2>
          <Link
            href="/matches"
            className="text-sm font-semibold text-amber-600 dark:text-amber-400"
          >
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
          <p
            className={`${cardClassName} border-dashed text-center text-sm text-zinc-500`}
          >
            No matches yet. Be the first to log one!
          </p>
        )}
      </section>
    </div>
  );
}
