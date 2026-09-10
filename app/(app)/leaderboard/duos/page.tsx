import DuosClient from "@/components/DuosClient";
import { createClient } from "@/lib/supabase/server";

export default async function DuosPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: pairs } = await supabase.from("teammate_pairs").select("*");

  return <DuosClient pairs={pairs ?? []} currentUserId={user!.id} />;
}
