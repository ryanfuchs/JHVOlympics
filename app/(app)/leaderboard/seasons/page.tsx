import SeasonsClient from "@/components/SeasonsClient";
import { createClient } from "@/lib/supabase/server";
import { seasonKeyFor } from "@/lib/seasons";

export default async function SeasonsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: currentSeason },
    { data: standings },
    { data: eventStandings },
    { data: champions },
    { data: medalTable },
  ] = await Promise.all([
    supabase.from("current_season").select("season_key").maybeSingle(),
    supabase.from("season_standings").select("*"),
    supabase.from("season_event_standings").select("*"),
    supabase.from("season_champions").select("*"),
    supabase.from("season_medal_table").select("*"),
  ]);

  return (
    <SeasonsClient
      currentSeasonKey={currentSeason?.season_key ?? seasonKeyFor(new Date())}
      standings={standings ?? []}
      eventStandings={eventStandings ?? []}
      champions={champions ?? []}
      medalTable={medalTable ?? []}
      currentUserId={user!.id}
    />
  );
}
