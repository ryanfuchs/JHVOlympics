"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import GameTypePicker, { type GameMode } from "@/components/GameTypePicker";
import PlayerPicker from "@/components/PlayerPicker";
import {
  DEFAULT_GAME_ICON,
  type GameIconKey,
} from "@/lib/game-icons";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card, { SectionTitle } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Textarea from "@/components/ui/Textarea";
import type { GameType, Profile } from "@/lib/types/database";
import { createClient } from "@/lib/supabase/client";
import { Gamepad2, Trophy, Users } from "lucide-react";

type MatchFormProps = {
  gameTypes: GameType[];
  profiles: Profile[];
  currentUserId: string;
};

export default function MatchForm({
  gameTypes: initialGameTypes,
  profiles,
  currentUserId,
}: MatchFormProps) {
  const router = useRouter();
  const [gameTypes, setGameTypes] = useState(initialGameTypes);
  const [gameMode, setGameMode] = useState<GameMode>(
    initialGameTypes.length > 0 ? "existing" : "new"
  );
  const [gameTypeId, setGameTypeId] = useState(initialGameTypes[0]?.id ?? "");
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
  const [newGameIcon, setNewGameIcon] = useState<GameIconKey>(DEFAULT_GAME_ICON);
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

    if (gameMode === "existing" && !gameTypeId) {
      setError("Please select a game type.");
      return;
    }
    if (gameMode === "new" && !newGameName.trim()) {
      setError("Please enter a name for the new game.");
      return;
    }

    setLoading(true);
    const supabase = createClient();

    let resolvedGameTypeId = gameTypeId;

    if (gameMode === "new") {
      const { data: newType, error: typeError } = await supabase
        .from("game_types")
        .insert({ name: newGameName.trim(), icon: newGameIcon })
        .select("*")
        .single();

      if (typeError) {
        setError(
          typeError.code === "23505"
            ? "A game with that name already exists — pick it from Existing."
            : typeError.message
        );
        setLoading(false);
        return;
      }

      resolvedGameTypeId = newType.id;
      setGameTypes((prev) =>
        [...prev, newType].sort((a, b) => a.name.localeCompare(b.name))
      );
      setGameTypeId(newType.id);
      setGameMode("existing");
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
    <form onSubmit={handleSubmit} className="space-y-5">
      <Card accent="amber">
        <SectionTitle icon={Gamepad2}>Game</SectionTitle>
        <div className="space-y-4">
          <GameTypePicker
            gameTypes={gameTypes}
            mode={gameMode}
            onModeChange={setGameMode}
            selectedGameTypeId={gameTypeId}
            onSelectedGameTypeIdChange={setGameTypeId}
            newGameName={newGameName}
            onNewGameNameChange={setNewGameName}
            newGameIcon={newGameIcon}
            onNewGameIconChange={(icon) => setNewGameIcon(icon as GameIconKey)}
          />
          <Field label="Date played">
            <Input
              type="datetime-local"
              value={playedAt}
              onChange={(e) => setPlayedAt(e.target.value)}
              required
            />
          </Field>
        </div>
      </Card>

      <Card accent="sky">
        <SectionTitle icon={Users}>Team 1</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
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
      </Card>

      <Card accent="rose">
        <SectionTitle icon={Users}>Team 2</SectionTitle>
        <div className="grid gap-4 sm:grid-cols-2">
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
      </Card>

      <Card>
        <SectionTitle icon={Trophy}>Final score</SectionTitle>
        <div className="flex items-center gap-3">
          <Input
            type="number"
            min={0}
            value={team1Score}
            onChange={(e) => setTeam1Score(e.target.value)}
            placeholder="0"
            className="min-h-16 text-center text-3xl font-bold font-mono"
            required
          />
          <span className="shrink-0 text-2xl font-light text-zinc-300 dark:text-zinc-600">
            –
          </span>
          <Input
            type="number"
            min={0}
            value={team2Score}
            onChange={(e) => setTeam2Score(e.target.value)}
            placeholder="0"
            className="min-h-16 text-center text-3xl font-bold font-mono"
            required
          />
        </div>
        <p className="mt-3 text-xs leading-relaxed text-zinc-500">
          ELO updates automatically — team average vs team average (K=32).
        </p>
      </Card>

      <Field label="Notes (optional)">
        <Textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Rematch, tournament round, trash talk…"
        />
      </Field>

      {error && <Alert>{error}</Alert>}

      <Button type="submit" disabled={loading}>
        {loading ? "Saving…" : "Log match"}
      </Button>
    </form>
  );
}
