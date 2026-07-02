"use client";

import { Field } from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import SegmentControl from "@/components/ui/SegmentControl";
import type { GameType } from "@/lib/types/database";

export type GameMode = "existing" | "new";

type GameTypePickerProps = {
  gameTypes: GameType[];
  mode: GameMode;
  onModeChange: (mode: GameMode) => void;
  selectedGameTypeId: string;
  onSelectedGameTypeIdChange: (id: string) => void;
  newGameName: string;
  onNewGameNameChange: (name: string) => void;
  newGameIcon: string;
  onNewGameIconChange: (icon: string) => void;
};

const QUICK_ICONS = ["🏓", "🏀", "⚽", "🎾", "🏐", "🎯", "🎮", "🏆"];

export default function GameTypePicker({
  gameTypes,
  mode,
  onModeChange,
  selectedGameTypeId,
  onSelectedGameTypeIdChange,
  newGameName,
  onNewGameNameChange,
  newGameIcon,
  onNewGameIconChange,
}: GameTypePickerProps) {
  const selected = gameTypes.find((g) => g.id === selectedGameTypeId);

  return (
    <div className="space-y-4">
      <SegmentControl
        options={[
          { value: "existing" as const, label: "Existing" },
          { value: "new" as const, label: "New game" },
        ]}
        value={mode}
        onChange={onModeChange}
      />

      {mode === "existing" ? (
        gameTypes.length > 0 ? (
          <div className="space-y-3">
            <Field label="Pick a game">
              <Select
                value={selectedGameTypeId}
                onChange={(e) => onSelectedGameTypeIdChange(e.target.value)}
                required
              >
                {gameTypes.map((gt) => (
                  <option key={gt.id} value={gt.id}>
                    {gt.icon}  {gt.name}
                  </option>
                ))}
              </Select>
            </Field>
            {selected && (
              <div className="flex items-center gap-3 rounded-2xl bg-gradient-to-r from-amber-500/10 via-orange-500/10 to-rose-500/10 px-4 py-3 ring-1 ring-amber-400/25 dark:from-amber-500/15 dark:via-orange-500/15 dark:to-rose-500/15">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-white to-amber-50 text-xl shadow-sm ring-1 ring-white/80 dark:from-zinc-900 dark:to-zinc-800 dark:ring-zinc-700">
                  {selected.icon}
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {selected.name}
                  </p>
                  <p className="text-xs text-zinc-500">Ready to log</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-4 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No games yet — tap <strong>New game</strong> to add the first one.
          </p>
        )
      ) : (
        <div className="space-y-4">
          <Field label="Game name">
            <Input
              type="text"
              value={newGameName}
              onChange={(e) => onNewGameNameChange(e.target.value)}
              placeholder="e.g. Beer Pong, Darts…"
              required={mode === "new"}
            />
          </Field>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Pick an icon
            </span>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {QUICK_ICONS.map((icon) => (
                <button
                  key={icon}
                  type="button"
                  onClick={() => onNewGameIconChange(icon)}
                  className={`flex aspect-square items-center justify-center rounded-2xl text-2xl transition-all active:scale-95 ${
                    newGameIcon === icon
                      ? "bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 shadow-lg shadow-orange-500/30 ring-2 ring-white/50"
                      : "bg-gradient-to-br from-white/90 to-zinc-100/80 shadow-sm ring-1 ring-white/80 hover:ring-amber-300/50 dark:from-zinc-900/90 dark:to-zinc-800/80 dark:ring-zinc-600/50"
                  }`}
                >
                  {icon}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
