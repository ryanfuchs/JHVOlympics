import MatchForm from "@/components/MatchForm";
import { createClient } from "@/lib/supabase/server";

export default async function NewMatchPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: gameTypes }, { data: profiles }] = await Promise.all([
    supabase.from("game_types").select("*").order("name"),
    supabase.from("profiles").select("*").order("display_name"),
  ]);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-bold tracking-tight">Log Match</h1>
        <p className="mt-1 text-zinc-500">Record a new competition</p>
      </header>

      <MatchForm
        gameTypes={gameTypes ?? []}
        profiles={profiles ?? []}
        currentUserId={user!.id}
      />
    </div>
  );
}
