"use client";

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
  const available = profiles.filter((p) => !excludeIds.includes(p.id) || p.id === value);

  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-zinc-700 dark:text-zinc-300">
        {label}
      </span>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full min-h-11 rounded-xl border border-zinc-300 bg-white px-3 py-2.5 text-base dark:border-zinc-700 dark:bg-zinc-900"
        required
      >
        <option value="">Select player…</option>
        {available.map((profile) => (
          <option key={profile.id} value={profile.id}>
            {profile.display_name}
          </option>
        ))}
      </select>
    </label>
  );
}
