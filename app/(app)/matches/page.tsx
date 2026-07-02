import MatchCard from "@/components/MatchCard";
import PageHeader from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/server";
import type { MatchWithDetails } from "@/lib/types/database";
import { cardClassName } from "@/lib/styles";

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
      <PageHeader
        title="Matches"
        description="All competitions logged"
      />

      {(matches as MatchWithDetails[] | null)?.length ? (
        <div className="space-y-3">
          {(matches as MatchWithDetails[]).map((match) => (
            <MatchCard key={match.id} match={match} />
          ))}
        </div>
      ) : (
        <p
          className={`${cardClassName} border-dashed text-center text-sm text-zinc-500`}
        >
          No matches logged yet.
        </p>
      )}
    </div>
  );
}
