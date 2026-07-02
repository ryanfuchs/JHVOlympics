import ProfileForm from "@/components/ProfileForm";
import PageHeader from "@/components/ui/PageHeader";
import { createClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: profile }, { data: stats }, { data: eloOverall }, { data: eloByGame }] =
    await Promise.all([
      supabase.from("profiles").select("*").eq("id", user!.id).single(),
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
        .from("player_elo_by_game")
        .select("*")
        .eq("user_id", user!.id)
        .order("game_name"),
    ]);

  return (
    <div className="space-y-6">
      <PageHeader title="Profile" description="Manage your account" />

      {profile && (
        <ProfileForm
          profile={profile}
          stats={stats}
          eloOverall={eloOverall}
          eloByGame={eloByGame ?? []}
        />
      )}
    </div>
  );
}
