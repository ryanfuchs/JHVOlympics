"use client";

import { Field } from "@/components/ui/Field";
import Select from "@/components/ui/Select";
import { isGuestPlayer } from "@/lib/guest";
import type { Profile } from "@/lib/types/database";

type PlayerPickerProps = {
  label: string;
  profiles: Profile[];
  value: string;
  onChange: (userId: string) => void;
  excludeIds?: string[];
};

export default function PlayerPicker({
  label,
  profiles,
  value,
  onChange,
  excludeIds = [],
}: PlayerPickerProps) {
  const available = profiles
    .filter((p) => !excludeIds.includes(p.id) || p.id === value)
    .sort((a, b) => {
      if (isGuestPlayer(a) !== isGuestPlayer(b)) {
        return isGuestPlayer(a) ? 1 : -1;
      }
      return a.display_name.localeCompare(b.display_name);
    });
  const selected = profiles.find((p) => p.id === value);

  return (
    <Field label={label}>
      <Select value={value} onChange={(e) => onChange(e.target.value)} required>
        <option value="">Choose player…</option>
        {available.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {isGuestPlayer(profile)
              ? `${profile.display_name} (guest)`
              : profile.display_name}
          </option>
        ))}
      </Select>
      {selected && (
        <p className="mt-2 flex items-center gap-2 text-xs text-zinc-500">
          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-amber-100 text-[11px] font-bold text-amber-700 dark:bg-amber-950 dark:text-amber-300">
            {selected.display_name.charAt(0).toUpperCase()}
          </span>
          Selected: {selected.display_name}
          {isGuestPlayer(selected) && (
            <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500 dark:bg-stone-800 dark:text-stone-400">
              guest
            </span>
          )}
        </p>
      )}
    </Field>
  );
}
