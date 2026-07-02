"use client";

import { useRouter } from "next/navigation";
import GameIcon from "@/components/GameIcon";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import type {
  PlayerEloByGame,
  PlayerEloOverall,
  PlayerStats,
  Profile,
} from "@/lib/types/database";

type ProfileFormProps = {
  profile: Profile;
  stats: PlayerStats | null;
  eloOverall: PlayerEloOverall | null;
  eloByGame: PlayerEloByGame[];
};

export default function ProfileForm({
  profile,
  stats,
  eloOverall,
  eloByGame,
}: ProfileFormProps) {
  const router = useRouter();
  const [displayName, setDisplayName] = useState(profile.display_name);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setMessage(null);

    const supabase = createClient();
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ display_name: displayName.trim() })
      .eq("id", profile.id);

    if (updateError) {
      setError(updateError.message);
      setLoading(false);
      return;
    }

    setMessage("Profile updated!");
    setLoading(false);
    router.refresh();
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
    router.refresh();
  }

  const myStats = stats ?? {
    wins: 0,
    losses: 0,
    ties: 0,
    win_rate: 0,
    total_matches: 0,
  };

  return (
    <div className="space-y-5">
      <Card accent="amber">
        <div className="flex items-center gap-4">
          <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-600 via-orange-700 to-orange-900 text-2xl font-bold text-orange-50 shadow-lg shadow-orange-950/20">
            {profile.display_name.charAt(0).toUpperCase()}
          </span>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-zinc-500">
              Your stats
            </p>
            <p className="font-mono text-3xl font-bold tracking-tight">
              {myStats.wins}-{myStats.losses}-{myStats.ties}
            </p>
            <p className="mt-1 text-sm text-zinc-500">
              {myStats.win_rate}% win rate · {myStats.total_matches} games
              {eloOverall?.rating != null && (
                <> · {eloOverall.rating} ELO</>
              )}
            </p>
          </div>
        </div>
      </Card>

      {eloByGame.length > 0 && (
        <Card>
          <p className="mb-3 text-xs font-bold uppercase tracking-wider text-zinc-500">
            ELO by game
          </p>
          <ul className="space-y-2">
            {eloByGame.map((row) => (
              <li
                key={row.game_type_id}
                className="flex items-center justify-between rounded-2xl bg-zinc-50 px-4 py-3 dark:bg-zinc-800/50"
              >
                <span className="flex items-center gap-2 text-sm font-medium">
                  <GameIcon icon={row.game_icon} size={16} />
                  {row.game_name}
                </span>
                <span className="font-mono text-lg font-bold text-orange-800 dark:text-orange-400">
                  {row.rating}
                </span>
              </li>
            ))}
          </ul>
        </Card>
      )}

      <Card>
        <form onSubmit={handleSave} className="space-y-4">
          <Field label="Display name">
            <Input
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
            />
          </Field>

          {message && <Alert variant="success">{message}</Alert>}
          {error && <Alert>{error}</Alert>}

          <Button type="submit" disabled={loading}>
            {loading ? "Saving…" : "Save profile"}
          </Button>
        </form>
      </Card>

      <Button type="button" variant="secondary" onClick={handleSignOut}>
        Sign out
      </Button>
    </div>
  );
}
