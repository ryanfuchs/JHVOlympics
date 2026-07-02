import type { PlayerStats } from "@/lib/types/database";

type LeaderboardTableProps = {
  stats: PlayerStats[];
  highlightUserId?: string;
};

export default function LeaderboardTable({
  stats,
  highlightUserId,
}: LeaderboardTableProps) {
  if (stats.length === 0) {
    return (
      <p className="rounded-2xl border border-dashed border-zinc-300 p-8 text-center text-zinc-500 dark:border-zinc-700">
        No stats yet. Log your first match!
      </p>
    );
  }

  const sorted = [...stats].sort((a, b) => {
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.win_rate !== a.win_rate) return b.win_rate - a.win_rate;
    return b.total_matches - a.total_matches;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-zinc-200 dark:border-zinc-800">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-zinc-200 bg-zinc-50 text-left text-xs uppercase tracking-wide text-zinc-500 dark:border-zinc-800 dark:bg-zinc-900/50">
            <th className="px-4 py-3 font-semibold">#</th>
            <th className="px-4 py-3 font-semibold">Player</th>
            <th className="px-4 py-3 text-center font-semibold">W-L-T</th>
            <th className="px-4 py-3 text-right font-semibold">Win%</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, index) => (
            <tr
              key={row.user_id}
              className={`border-b border-zinc-100 last:border-0 dark:border-zinc-800/80 ${
                row.user_id === highlightUserId
                  ? "bg-amber-50 dark:bg-amber-950/30"
                  : ""
              }`}
            >
              <td className="px-4 py-3 font-mono text-zinc-400">{index + 1}</td>
              <td className="px-4 py-3 font-medium">{row.display_name}</td>
              <td className="px-4 py-3 text-center font-mono">
                {row.wins}-{row.losses}-{row.ties}
              </td>
              <td className="px-4 py-3 text-right font-mono font-semibold">
                {row.win_rate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
