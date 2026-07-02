import Link from "next/link";
import EloHistoryChart from "@/components/EloHistoryChart";
import MatchCard from "@/components/MatchCard";
import PageHeader from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/server";
import { buildEloHistory, type EloChangeRow } from "@/lib/elo-history";
import type { MatchWithDetails } from "@/lib/types/database";
import { cardClassName, textAccent } from "@/lib/styles";
import { APP_NAME, APP_SLOGAN } from "@/lib/branding";

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: stats }, { data: eloOverall }, { data: recentMatches }, { data: eloChanges }] =
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
      supabase
        .from("match_elo_changes")
        .select(
          `
          user_id,
          rating_after,
          matches!inner ( played_at, game_type_id ),
          profiles!inner ( display_name )
        `
        ),
    ]);

  const { players, chartData } = buildEloHistory(
    (eloChanges as EloChangeRow[] | null) ?? []
  );

  const myStats = stats ?? {
    wins: 0,
    losses: 0,
    ties: 0,
    win_rate: 0,
    total_matches: 0,
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow={APP_NAME}
        title="Dashboard"
        description={APP_SLOGAN}
      />

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-800 via-orange-900 to-stone-950 p-6 text-orange-50 shadow-xl shadow-orange-950/25 ring-1 ring-orange-700/30">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-12 -left-8 h-36 w-36 rounded-full bg-orange-600/10 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">
            Your record
          </p>
          <p className="mt-2 font-mono text-5xl font-bold tracking-tight drop-shadow-sm">
            {myStats.wins}-{myStats.losses}-{myStats.ties}
          </p>
          <div className="mt-3 flex flex-wrap gap-2 text-sm">
            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm ring-1 ring-white/20">
              {myStats.win_rate}% win rate
            </span>
            <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm ring-1 ring-white/20">
              {myStats.total_matches} games
            </span>
            {eloOverall?.rating != null && (
              <span className="rounded-full bg-white/15 px-3 py-1 backdrop-blur-sm ring-1 ring-white/20">
                {eloOverall.rating} ELO
              </span>
            )}
          </div>
          <Link
            href="/matches/new"
            className="mt-5 inline-flex min-h-11 items-center rounded-2xl bg-orange-950/30 px-5 py-2.5 text-sm font-semibold text-orange-50 ring-1 ring-orange-400/25 transition-all hover:bg-orange-950/45"
          >
            Log a match →
          </Link>
        </div>
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
            ELO evolution
          </h2>
          <p className="mt-1 text-sm text-stone-500 dark:text-stone-400">
            Overall rating over time for every player
          </p>
        </div>
        <EloHistoryChart
          players={players}
          chartData={chartData}
          currentUserId={user!.id}
        />
      </section>

      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-bold tracking-tight text-stone-900 dark:text-stone-50">
            Recent matches
          </h2>
          <Link
            href="/matches"
            className={`text-sm font-semibold underline-offset-4 hover:underline ${textAccent}`}
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
