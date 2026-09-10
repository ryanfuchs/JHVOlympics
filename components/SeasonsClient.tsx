"use client";

import { useMemo, useState } from "react";
import { Medal, Trophy } from "lucide-react";
import GameIcon from "@/components/GameIcon";
import RanksTabs from "@/components/RanksTabs";
import PageHeader from "@/components/ui/PageHeader";
import Card, { SectionTitle } from "@/components/ui/Card";
import { isGuestPlayer } from "@/lib/guest";
import {
  daysLeftInSeason,
  formatSeasonKey,
  formatSeasonRange,
  seasonKeyRange,
  seasonProgress,
} from "@/lib/seasons";
import {
  cardClassName,
  chipActiveClassName,
  chipClassName,
  chipInactiveClassName,
  surfaceMuted,
  textAccent,
} from "@/lib/styles";
import type {
  SeasonChampion,
  SeasonEventStanding,
  SeasonMedalTableRow,
  SeasonStanding,
} from "@/lib/types/database";

type SeasonsClientProps = {
  currentSeasonKey: string;
  standings: SeasonStanding[];
  eventStandings: SeasonEventStanding[];
  champions: SeasonChampion[];
  medalTable: SeasonMedalTableRow[];
  currentUserId: string;
};

const podiumStyles = [
  "bg-gradient-to-br from-amber-200 to-amber-400 text-amber-950 ring-amber-500/40 dark:from-amber-400 dark:to-amber-600 dark:text-amber-950",
  "bg-gradient-to-br from-stone-200 to-stone-300 text-stone-800 ring-stone-400/40 dark:from-stone-400 dark:to-stone-500 dark:text-stone-900",
  "bg-gradient-to-br from-orange-300 to-orange-500 text-orange-950 ring-orange-600/40 dark:from-orange-500 dark:to-orange-700 dark:text-orange-50",
];

function formatDelta(value: number): string {
  return value > 0 ? `+${value}` : `${value}`;
}

function deltaClass(value: number): string {
  if (value > 0) return "text-emerald-700 dark:text-emerald-400";
  if (value < 0) return "text-red-700 dark:text-red-400";
  return "text-stone-500 dark:text-stone-400";
}

function GuestBadge() {
  return (
    <span className="rounded-full bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-stone-500 dark:bg-stone-800 dark:text-stone-400">
      guest
    </span>
  );
}

export default function SeasonsClient({
  currentSeasonKey,
  standings,
  eventStandings,
  champions,
  medalTable,
  currentUserId,
}: SeasonsClientProps) {
  const seasonKeys = useMemo(() => {
    const earliest = standings.reduce<string | null>(
      (min, row) => (min === null || row.season_key < min ? row.season_key : min),
      null
    );
    return seasonKeyRange(earliest ?? currentSeasonKey, currentSeasonKey);
  }, [standings, currentSeasonKey]);

  const [selected, setSelected] = useState(currentSeasonKey);
  const isLive = selected === currentSeasonKey;

  const seasonRows = useMemo(
    () =>
      standings
        .filter((row) => row.season_key === selected)
        .sort((a, b) => a.rank - b.rank),
    [standings, selected]
  );

  const podium = seasonRows.filter((row) => row.qualified && row.rank <= 3);
  const champion = champions.find((c) => c.season_key === selected);

  const eventChampions = useMemo(() => {
    const byGame = new Map<string, SeasonEventStanding>();
    eventStandings
      .filter(
        (row) => row.season_key === selected && row.qualified && row.rank === 1
      )
      .forEach((row) => {
        if (!byGame.has(row.game_type_id)) byGame.set(row.game_type_id, row);
      });
    return [...byGame.values()].sort((a, b) =>
      a.game_name.localeCompare(b.game_name)
    );
  }, [eventStandings, selected]);

  const rankedMedalTable = useMemo(
    () =>
      [...medalTable].sort(
        (a, b) =>
          b.titles - a.titles ||
          b.gold - a.gold ||
          b.silver - a.silver ||
          b.bronze - a.bronze ||
          a.display_name.localeCompare(b.display_name)
      ),
    [medalTable]
  );

  const daysLeft = daysLeftInSeason(selected);
  const progress = Math.round(seasonProgress(selected) * 100);

  return (
    <div className="space-y-5">
      <PageHeader
        title="Seasons"
        description="Every quarter is a fresh championship"
      />

      <RanksTabs />

      <div className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {seasonKeys.map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setSelected(key)}
            className={`${chipClassName} gap-1.5 ${
              selected === key ? chipActiveClassName : chipInactiveClassName
            }`}
          >
            {key === currentSeasonKey && (
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            )}
            {formatSeasonKey(key)}
          </button>
        ))}
      </div>

      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-orange-800 via-orange-900 to-stone-950 p-6 text-orange-50 shadow-xl shadow-orange-950/25 ring-1 ring-orange-700/30">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-orange-500/15 blur-3xl" />
        <div className="relative">
          <p className="text-xs font-bold uppercase tracking-wider text-white/70">
            {formatSeasonRange(selected)}
          </p>
          <h2 className="mt-1.5 text-3xl font-bold tracking-tight">
            {formatSeasonKey(selected)}
          </h2>

          {isLive ? (
            <>
              <p className="mt-2 text-sm text-orange-100/80">
                {daysLeft} {daysLeft === 1 ? "day" : "days"} left to claim the
                title
              </p>
              <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-orange-300"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : champion ? (
            <p className="mt-2 flex items-center gap-2 text-sm text-orange-100/90">
              <Trophy size={16} aria-hidden />
              <span>
                Champion:{" "}
                <span className="font-semibold text-white">
                  {champion.display_name}
                </span>{" "}
                ({formatDelta(champion.elo_delta)} ELO)
              </span>
            </p>
          ) : (
            <p className="mt-2 text-sm text-orange-100/80">
              Season closed without a champion — nobody played enough matches.
            </p>
          )}
        </div>
      </section>

      {podium.length > 0 && (
        <div className="grid grid-cols-3 gap-2">
          {podium.slice(0, 3).map((row, index) => (
            <div
              key={row.user_id}
              className={`rounded-2xl p-3 text-center ring-1 ${
                podiumStyles[Math.min(index, 2)]
              }`}
            >
              <p className="font-mono text-xs font-bold opacity-70">
                #{row.rank}
              </p>
              <p className="mt-1 truncate text-sm font-bold">
                {row.display_name}
              </p>
              <p className="font-mono text-xs opacity-80">
                {formatDelta(row.elo_delta)}
              </p>
            </div>
          ))}
        </div>
      )}

      <Card className="p-0">
        {seasonRows.length === 0 ? (
          <p className="p-5 text-center text-sm text-stone-500">
            No matches played this season yet.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200/80 bg-orange-50/60 text-left text-[11px] uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-orange-950/20 dark:text-stone-400">
                <th className="px-4 py-3.5 font-bold">#</th>
                <th className="px-4 py-3.5 font-bold">Player</th>
                <th className="px-4 py-3.5 text-right font-bold">ELO ±</th>
                <th className="px-4 py-3.5 text-center font-bold">W-L-T</th>
              </tr>
            </thead>
            <tbody>
              {seasonRows.map((row) => (
                <tr
                  key={row.user_id}
                  className={`border-b border-stone-100/80 last:border-0 dark:border-stone-800/60 ${
                    row.user_id === currentUserId
                      ? "bg-orange-50/80 dark:bg-orange-950/20"
                      : ""
                  }`}
                >
                  <td className="px-4 py-3.5 font-mono text-xs text-stone-400">
                    {row.qualified ? row.rank : "—"}
                  </td>
                  <td className="px-4 py-3.5 font-semibold">
                    <span className="inline-flex items-center gap-1.5">
                      {row.display_name}
                      {isGuestPlayer(row) && <GuestBadge />}
                      {!row.qualified && !isGuestPlayer(row) && (
                        <span className="text-[10px] font-medium uppercase tracking-wide text-stone-400">
                          unranked
                        </span>
                      )}
                    </span>
                  </td>
                  <td
                    className={`px-4 py-3.5 text-right font-mono font-bold ${deltaClass(
                      row.elo_delta
                    )}`}
                  >
                    {formatDelta(row.elo_delta)}
                  </td>
                  <td className="px-4 py-3.5 text-center font-mono text-stone-600 dark:text-stone-300">
                    {row.wins}-{row.losses}-{row.ties}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </Card>

      {eventChampions.length > 0 && (
        <section>
          <SectionTitle icon={Medal}>
            {isLive ? "Event leaders" : "Event champions"}
          </SectionTitle>
          <div className="space-y-2">
            {eventChampions.map((row) => (
              <div
                key={row.game_type_id}
                className={`flex items-center justify-between rounded-2xl px-4 py-3 ${surfaceMuted}`}
              >
                <span className="flex items-center gap-2.5 text-sm font-medium text-stone-700 dark:text-stone-200">
                  <GameIcon icon={row.game_icon} size={16} />
                  {row.game_name}
                </span>
                <span className="flex items-center gap-2 text-sm">
                  <span className="font-semibold">{row.display_name}</span>
                  <span className={`font-mono text-xs ${deltaClass(row.elo_delta)}`}>
                    {formatDelta(row.elo_delta)}
                  </span>
                </span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section>
        <SectionTitle icon={Trophy}>All-time medal table</SectionTitle>
        {rankedMedalTable.length === 0 ? (
          <p
            className={`${cardClassName} border-dashed text-center text-sm text-stone-500`}
          >
            Nothing here until the first season wraps up.
          </p>
        ) : (
          <Card className="p-0">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-stone-200/80 bg-orange-50/60 text-left text-[11px] uppercase tracking-wider text-stone-500 dark:border-stone-800 dark:bg-orange-950/20 dark:text-stone-400">
                  <th className="px-4 py-3.5 font-bold">Player</th>
                  <th className="px-3 py-3.5 text-center font-bold">Titles</th>
                  <th className="px-2 py-3.5 text-center font-bold">🥇</th>
                  <th className="px-2 py-3.5 text-center font-bold">🥈</th>
                  <th className="px-2 py-3.5 text-center font-bold">🥉</th>
                </tr>
              </thead>
              <tbody>
                {rankedMedalTable.map((row) => (
                  <tr
                    key={row.user_id}
                    className={`border-b border-stone-100/80 last:border-0 dark:border-stone-800/60 ${
                      row.user_id === currentUserId
                        ? "bg-orange-50/80 dark:bg-orange-950/20"
                        : ""
                    }`}
                  >
                    <td className="px-4 py-3.5 font-semibold">
                      {row.display_name}
                    </td>
                    <td className={`px-3 py-3.5 text-center font-mono font-bold ${textAccent}`}>
                      {row.titles}
                    </td>
                    <td className="px-2 py-3.5 text-center font-mono">{row.gold}</td>
                    <td className="px-2 py-3.5 text-center font-mono">{row.silver}</td>
                    <td className="px-2 py-3.5 text-center font-mono">{row.bronze}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        )}
      </section>
    </div>
  );
}
