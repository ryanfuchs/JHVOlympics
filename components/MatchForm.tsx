"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import PlayerPicker from "@/components/PlayerPicker";
import type { GameType, Profile } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";

type MatchFormProps = {
  gameTypes: GameType[];
  profiles: Profile[];
  currentUserId: string;
};

export default function MatchForm({
  gameTypes,
  profiles,
  currentUserId,
}: MatchFormProps) {
  const router = useRouter();
  const [gameTypeId, setGameTypeId] = useState(gameTypes[0]?.id ?? "");
  const [team1Player1, setTeam1Player1] = useState(currentUserId);
  const [team1Player2, setTeam1Player2] = useState("");
  const [team2Player1, setTeam2Player1] = useState("");
  const [team2Player2, setTeam2Player2] = useState("");
  const [team1Score, setTeam1Score] = useState("");
  const [team2Score, setTeam2Score] = useState("");
  const [playedAt, setPlayedAt] = useState(
    new Date().toISOString().slice(0, 16)
  );
  const [notes, setNotes] = useState("");
  const [newGameName, setNewGameName] = useState("");
  const [showNewGame, setShowNewGame] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const selectedIds = [
    team1Player1,
    team1Player2,
    team2Player1,
    team2Player2,
  ].filter(Boolean);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const players = [team1Player1, team1Player2, team2Player1, team2Player2];
    if (players.some((p) => !p)) {
      setError("Please select all four players.");
      return;
    }
    if (new Set(players).size !== 4) {
      setError("Each player can only appear once.");
      return;
    }

    const score1 = parseInt(team1Score, 10);
    const score2 = parseInt(team2Score, 10);
    if (isNaN(score1) || isNaN(score2) || score1 < 0 || score2 < 0) {
      setError("Please enter valid scores (0 or higher).");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    let resolvedGameTypeId = gameTypeId;

    if (showNewGame && newGameName.trim()) {
      const { data: newType, error: typeError } = await supabase
        .from("game_types")
        .insert({ name: newGameName.trim(), icon: "🏆" })
        .select("id")
        .single();

      if (typeError) {
        setError(typeError.message);
        setLoading(false);
        return;
      }
      resolvedGameTypeId = newType.id;
    }

    const { data: match, error: matchError } = await supabase
      .from("matches")
      .insert({
        game_type_id: resolvedGameTypeId,
        team1_score: score1,
        team2_score: score2,
        played_at: new Date(playedAt).toISOString(),
        created_by: currentUserId,
        notes: notes.trim() || null,
      })
      .select("id")
      .single();

    if (matchError || !match) {
      setError(matchError?.message ?? "Failed to create match.");
      setLoading(false);
      return;
    }

    const { error: playersError } = await supabase.from("match_players").insert([
      { match_id: match.id, user_id: team1Player1, team: 1, slot: 1 },
      { match_id: match.id, user_id: team1Player2, team: 1, slot: 2 },
      { match_id: match.id, user_id: team2Player1, team: 2, slot: 1 },
      { match_id: match.id, user_id: team2Player2, team: 2, slot: 2 },
    ]);

    if (playersError) {
      setError(playersError.message);
      setLoading(false);
      return;
    }

    router.push(`/matches/${match.id}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Game</h2>
        {!showNewGame ? (
          <div className="space-y-2">
            <select
              value={gameTypeId}
              onChange={(e) => setGameTypeId(e.target.value)}
              className="w-full min-h-11 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-base dark:border-zinc-700 dark:bg-zinc-900"
              required
            >
              {gameTypes.map((gt) => (
                <option key={gt.id} value={gt.id}>
                  {gt.icon} {gt.name}
                </option>
              ))}
            </select>
            <button
              type="button"
              onClick={() => setShowNewGame(true)}
              className="text-sm text-amber-600 dark:text-amber-400"
            >
              + Add new game type
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <input
              type="text"
              value={newGameName}
              onChange={(e) => setNewGameName(e.target.value)}
              placeholder="New game name"
              className="w-full min-h-11 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-base dark:border-zinc-700 dark:bg-zinc-900"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewGame(false)}
              className="text-sm text-zinc-500"
            >
              Use existing game type
            </button>
          </div>
        )}

        <label className="block">
          <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
            Date played
          </span>
          <input
            type="datetime-local"
            value={playedAt}
            onChange={(e) => setPlayedAt(e.target.value)}
            className="w-full min-h-11 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-base dark:border-zinc-700 dark:bg-zinc-900"
            required
          />
        </label>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Team 1</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PlayerPicker
            label="Player 1"
            profiles={profiles}
            value={team1Player1}
            onChange={setTeam1Player1}
            excludeIds={selectedIds.filter((id) => id !== team1Player1)}
          />
          <PlayerPicker
            label="Player 2"
            profiles={profiles}
            value={team1Player2}
            onChange={setTeam1Player2}
            excludeIds={selectedIds.filter((id) => id !== team1Player2)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Team 2</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <PlayerPicker
            label="Player 1"
            profiles={profiles}
            value={team2Player1}
            onChange={setTeam2Player1}
            excludeIds={selectedIds.filter((id) => id !== team2Player1)}
          />
          <PlayerPicker
            label="Player 2"
            profiles={profiles}
            value={team2Player2}
            onChange={setTeam2Player2}
            excludeIds={selectedIds.filter((id) => id !== team2Player2)}
          />
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Score</h2>
        <div className="flex items-center gap-4">
          <input
            type="number"
            min={0}
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            placeholder="0"
            className="min-h-14 flex-1 rounded-xl border border-zinc-300 bg-white px-4 text-center text-3xl font-bold font-mono dark:border-zinc-700 dark:bg-zinc-900"
            required
          />
          <span className="text-2xl font-light text-zinc-400">–</span>
          <input
            type="number"
            min={0}
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            placeholder="0"
            className="min-h-14 flex-1 rounded-xl border border-zinc-300 bg-white px-4 text-center text-3xl font-bold font-mono dark:border-zinc-700 dark:bg-zinc-900"
            required
          />
        </div>
      </section>

      <label className="block">
        <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
          Notes (optional)
        </span>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-base dark:border-zinc-700 dark:bg-zinc-900"
          placeholder="Rematch, tournament round, etc."
        />
      </label>

      {error && (
        <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="min-h-12 w-full rounded-xl bg-amber-500 px-4 py-3 text-base font-semibold text-white transition-colors hover:bg-amber-600 disabled:opacity-50"
      >
        {loading ? "Saving…" : "Log Match"}
      </button>
    </form>
  );
}
