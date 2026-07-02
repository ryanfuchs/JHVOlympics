import LeaderboardClient from "@/components/LeaderboardClient";
import { createClient } from "@/lib/supabase/server";

export default async function LeaderboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [
    { data: overallStats },
    { data: statsByGame },
    { data: eloOverall },
    { data: eloByGame },
    { data: gameTypes },
  ] = await Promise.all([
    supabase.from("player_stats").select("*"),
    supabase.from("player_stats_by_game").select("*"),
    supabase.from("player_elo_overall").select("*"),
    supabase.from("player_elo_by_game").select("*"),
    supabase.from("game_types").select("*").order("name"),
  ]);

  return (
    <LeaderboardClient
      overallStats={overallStats ?? []}
      statsByGame={statsByGame ?? []}
      eloOverall={eloOverall ?? []}
      eloByGame={eloByGame ?? []}
      gameTypes={gameTypes ?? []}
      currentUserId={user!.id}
    />
  );
}
