import MatchForm from "@/components/MatchForm";
import PageHeader from "@/components/ui/PageHeader";
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
      <PageHeader
        title="Log match"
        description="Record a new competition"
      />

      <MatchForm
        gameTypes={gameTypes ?? []}
        profiles={profiles ?? []}
        currentUserId={user!.id}
      />
    </div>
  );
}
