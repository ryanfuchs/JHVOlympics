import MatchCard from "@/components/MatchCard";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithDetails } from "@/lib/types/database";

export default async function MatchesPage() {
  const supabase = await createClient();

  const { data: matches } = await supabase
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
    .order("played_at", { ascending: false });

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Matches</h1>
        <p className="mt-1 text-zinc-500">All competitions logged</p>
      </header>

      {(matches as MatchWithDetails[] | null)?.length ? (
        <div className="space-y-3">
          {(matches as MatchWithDetails[]).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
          No matches logged yet.
        </p>
      )}
    </div>
  );
}
