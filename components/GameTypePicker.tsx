"use client";

import { Field } from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import Select from "@/components/ui/Select";
import SegmentControl from "@/components/ui/SegmentControl";
import GameIcon from "@/components/GameIcon";
import {
  GAME_ICON_KEYS,
  GAME_ICON_LABELS,
} from "@/lib/game-icons";
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
                    {gt.name}
                  </option>
                ))}
              </Select>
            </Field>
            {selected && (
              <div className="flex items-center gap-3 rounded-2xl bg-zinc-50 px-4 py-3 ring-1 ring-zinc-200/80 dark:bg-zinc-800/50 dark:ring-zinc-700/80">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white shadow-sm ring-1 ring-zinc-200/80 dark:bg-zinc-900 dark:ring-zinc-700">
                  <GameIcon icon={selected.icon} size={20} />
                </span>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                    {selected.name}
                  </p>
                  <p className="text-xs text-zinc-500">Selected</p>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p className="rounded-2xl border border-dashed border-zinc-300 px-4 py-4 text-center text-sm text-zinc-500 dark:border-zinc-700">
            No games yet — use <strong>New game</strong> to add the first one.
          </p>
        )
      ) : (
        <div className="space-y-4">
          <Field label="Game name">
            <Input
              type="text"
              value={newGameName}
              onChange={(e) => onNewGameNameChange(e.target.value)}
              placeholder="e.g. Darts, Pool, Chess"
              required={mode === "new"}
            />
          </Field>

          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-zinc-500">
              Category icon
            </span>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {GAME_ICON_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  title={GAME_ICON_LABELS[key]}
                  onClick={() => onNewGameIconChange(key)}
                  className={`flex aspect-square items-center justify-center rounded-2xl transition-all active:scale-95 ${
                    newGameIcon === key
                      ? "bg-zinc-900 text-white shadow-lg shadow-zinc-900/25 ring-2 ring-zinc-400/30 dark:bg-white dark:text-zinc-900"
                      : "bg-white/90 text-zinc-600 shadow-sm ring-1 ring-zinc-200/80 hover:ring-zinc-300 dark:bg-zinc-900/90 dark:text-zinc-300 dark:ring-zinc-600/50"
                  }`}
                >
                  <GameIcon
                    icon={key}
                    size={20}
                    className={
                      newGameIcon === key
                        ? "text-inherit"
                        : "text-zinc-600 dark:text-zinc-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
