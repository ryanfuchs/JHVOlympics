"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import type { PlayerStats, Profile } from "@/lib/types/database";

type ProfileFormProps = {
  profile: Profile;
  stats: PlayerStats | null;
};

export default function ProfileForm({ profile, stats }: ProfileFormProps) {
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
    <div className="space-y-8">
      <section className="rounded-2xl border border-zinc-200 bg-white p-6 dark:border-zinc-800 dark:bg-zinc-900">
        <p className="text-sm text-zinc-500">Your stats</p>
        <p className="mt-1 font-mono text-3xl font-bold">
          {myStats.wins}-{myStats.losses}-{myStats.ties}
        </p>
        <p className="mt-1 text-sm text-zinc-500">
          {myStats.win_rate}% win rate · {myStats.total_matches} games
        </p>
      </section>

      <form onSubmit={handleSave} className="space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-sm font-medium">Display name</span>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full min-h-11 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 dark:border-zinc-700 dark:bg-zinc-900"
            required
          />
        </label>

        {message && (
          <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
            {message}
          </p>
        )}
        {error && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="min-h-12 w-full rounded-xl bg-amber-500 font-semibold text-white hover:bg-amber-600 disabled:opacity-50"
        >
          {loading ? "Saving…" : "Save profile"}
        </button>
      </form>

      <button
        type="button"
        onClick={handleSignOut}
        className="min-h-12 w-full rounded-xl border border-zinc-300 font-medium text-zinc-700 dark:border-zinc-700 dark:text-zinc-300"
      >
        Sign out
      </button>
    </div>
  );
}
