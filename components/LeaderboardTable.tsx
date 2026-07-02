import { cardClassName } from "@/lib/styles";

export type LeaderboardRow = {
  user_id: string;
  display_name: string;
  wins: number;
  losses: number;
  ties: number;
  win_rate: number;
  total_matches: number;
  rating: number | null;
};

type LeaderboardTableProps = {
  rows: LeaderboardRow[];
  highlightUserId?: string;
  sortBy: "elo" | "wins";
};

export default function LeaderboardTable({
  rows,
  highlightUserId,
  sortBy,
}: LeaderboardTableProps) {
  if (rows.length === 0) {
    return (
      <p className={`${cardClassName} border-dashed text-center text-sm text-zinc-500`}>
        No stats yet. Log your first match!
      </p>
    );
  }

  const sorted = [...rows].sort((a, b) => {
    if (sortBy === "elo") {
      if ((b.rating ?? 0) !== (a.rating ?? 0)) {
        return (b.rating ?? 0) - (a.rating ?? 0);
      }
    }
    if (b.wins !== a.wins) return b.wins - a.wins;
    if (b.win_rate !== a.win_rate) return b.win_rate - a.win_rate;
    return b.total_matches - a.total_matches;
  });

  return (
    <div className={`${cardClassName} overflow-hidden p-0`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-stone-200/80 bg-orange-50/60 text-left text-[11px] uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-orange-950/20 dark:text-stone-400">
            <th className="px-4 py-3.5 font-bold">#</th>
            <th className="px-4 py-3.5 font-bold">Player</th>
            <th className="px-4 py-3.5 text-right font-bold">ELO</th>
            <th className="px-4 py-3.5 text-center font-bold">W-L-T</th>
            <th className="px-4 py-3.5 text-right font-bold">Win%</th>
          </tr>
        </thead>
        <tbody>
          {sorted.map((row, index) => (
            <tr
              key={row.user_id}
              className={`border-b border-zinc-100/80 last:border-0 dark:border-zinc-800/60 ${
                row.user_id === highlightUserId
                  ? "bg-orange-50/80 dark:bg-orange-950/20"
                  : ""
              }`}
            >
              <td className="px-4 py-3.5 font-mono text-xs text-zinc-400">
                {index + 1}
              </td>
              <td className="px-4 py-3.5 font-semibold">{row.display_name}</td>
              <td className="px-4 py-3.5 text-right font-mono font-bold text-zinc-900 dark:text-zinc-100">
                {row.rating ?? "—"}
              </td>
              <td className="px-4 py-3.5 text-center font-mono text-zinc-600 dark:text-zinc-300">
                {row.wins}-{row.losses}-{row.ties}
              </td>
              <td className="px-4 py-3.5 text-right font-mono font-medium">
                {row.win_rate}%
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
