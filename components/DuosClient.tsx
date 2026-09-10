"use client";

import { useMemo, useState } from "react";
import { ThumbsDown, Sparkles } from "lucide-react";
import RanksTabs from "@/components/RanksTabs";
import PageHeader from "@/components/ui/PageHeader";
import SegmentControl from "@/components/ui/SegmentControl";
import Card, { SectionTitle } from "@/components/ui/Card";
import {
  cardClassName,
  chipActiveClassName,
  chipClassName,
  chipInactiveClassName,
  surfaceMuted,
} from "@/lib/styles";
import type { TeammatePair } from "@/lib/types/database";

type DuosClientProps = {
  pairs: TeammatePair[];
  currentUserId: string;
};

const MIN_MATCH_OPTIONS = [1, 3, 5];

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function chemistryClass(value: number): string {
  if (value > 0) return "text-emerald-700 dark:text-emerald-400";
  if (value < 0) return "text-red-700 dark:text-red-400";
  return "text-stone-500 dark:text-stone-400";
}

function pairKey(pair: TeammatePair): string {
  return `${pair.player_a_id}:${pair.player_b_id}`;
}

function PairNames({ pair }: { pair: TeammatePair }) {
  return (
    <span className="inline-flex flex-wrap items-center gap-x-1.5">
      <span>{pair.player_a_name}</span>
      <span className="text-stone-400">&amp;</span>
      <span>{pair.player_b_name}</span>
    </span>
  );
}

function HighlightRow({ pair }: { pair: TeammatePair }) {
  return (
    <div
      className={`flex items-center justify-between gap-3 rounded-2xl px-4 py-3 ${surfaceMuted}`}
    >
      <span className="text-sm font-semibold text-stone-800 dark:text-stone-100">
        <PairNames pair={pair} />
      </span>
      <span className="flex shrink-0 items-center gap-3 text-xs">
        <span className="font-mono text-stone-500 dark:text-stone-400">
          {pair.wins}-{pair.losses}-{pair.ties}
        </span>
        <span className={`font-mono font-bold ${chemistryClass(pair.chemistry)}`}>
          {formatDelta(pair.chemistry)}
        </span>
      </span>
    </div>
  );
}

export default function DuosClient({ pairs, currentUserId }: DuosClientProps) {
  const [scope, setScope] = useState<"all" | "mine">("all");
  const [minMatches, setMinMatches] = useState(3);

  const filtered = useMemo(() => {
    const scoped =
      scope === "mine"
        ? pairs.filter(
            (p) =>
              p.player_a_id === currentUserId || p.player_b_id === currentUserId
          )
        : pairs;
    return scoped.filter((p) => p.matches_together >= minMatches);
  }, [pairs, scope, minMatches, currentUserId]);

  const sorted = useMemo(
    () =>
      [...filtered].sort(
        (a, b) =>
          b.chemistry - a.chemistry ||
          b.matches_together - a.matches_together ||
          a.player_a_name.localeCompare(b.player_a_name)
      ),
    [filtered]
  );

  const best = sorted.slice(0, 3);
  const worst = sorted
    .slice(-3)
    .reverse()
    .filter((pair) => !best.some((b) => pairKey(b) === pairKey(pair)));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Duos"
        description="Which teammate combinations actually work"
      />

      <RanksTabs />

      <SegmentControl
        options={[
          { value: "all" as const, label: "Everyone" },
          { value: "mine" as const, label: "My duos" },
        ]}
        value={scope}
        onChange={setScope}
      />

      <div className="flex gap-2">
        {MIN_MATCH_OPTIONS.map((option) => (
          <button
            key={option}
            type="button"
            onClick={() => setMinMatches(option)}
            className={`${chipClassName} ${
              minMatches === option ? chipActiveClassName : chipInactiveClassName
            }`}
          >
            {option}+ games
          </button>
        ))}
      </div>

      {sorted.length === 0 ? (
        <p
          className={`${cardClassName} border-dashed text-center text-sm text-stone-500`}
        >
          No duos with {minMatches}+ games together yet.
        </p>
      ) : (
        <>
          <section>
            <SectionTitle icon={Sparkles}>Best combinations</SectionTitle>
            <div className="space-y-2">
              {best.map((pair) => (
                <HighlightRow key={pairKey(pair)} pair={pair} />
              ))}
            </div>
          </section>

          {worst.length > 0 && (
            <section>
              <SectionTitle icon={ThumbsDown}>Worst combinations</SectionTitle>
              <div className="space-y-2">
                {worst.map((pair) => (
                  <HighlightRow key={pairKey(pair)} pair={pair} />
                ))}
              </div>
            </section>
          )}

          <Card className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200/80 bg-orange-50/60 text-left text-[11px] uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-orange-950/20 dark:text-stone-400">
                  <th className="px-4 py-3.5 font-bold">Duo</th>
                  <th className="px-3 py-3.5 text-center font-bold">W-L-T</th>
                  <th className="px-3 py-3.5 text-right font-bold">Win%</th>
                  <th className="px-4 py-3.5 text-right font-bold">Chem</th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((pair) => (
                  <tr
                    key={pairKey(pair)}
                    className={`border-b border-stone-100/80 last:border-0 dark:border-stone-800/60 ${
                      pair.player_a_id === currentUserId ||
                      pair.player_b_id === currentUserId
                        ? "bg-orange-50/80 dark:bg-orange-950/20"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 font-semibold">
                      <PairNames pair={pair} />
                    </td>
                    <td className="px-3 py-3.5 text-center font-mono text-stone-600 dark:text-stone-300">
                      {pair.wins}-{pair.losses}-{pair.ties}
                    </td>
                    <td className="px-3 py-3.5 text-right font-mono">
                      {pair.win_rate}%
                    </td>
                    <td
                      className={`px-4 py-3.5 text-right font-mono font-bold ${chemistryClass(
                        pair.chemistry
                      )}`}
                    >
                      {formatDelta(pair.chemistry)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </>
      )}

      <p className="px-1 text-xs leading-relaxed text-stone-500 dark:text-stone-400">
        <strong className="font-semibold">Chem</strong> compares the duo&apos;s
        win rate to what the two players average on their own. Positive means
        they lift each other; negative means they get in each other&apos;s way.
      </p>
    </div>
  );
}
