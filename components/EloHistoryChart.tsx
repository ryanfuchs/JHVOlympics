"use client";

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { cardClassName } from "@/lib/styles";
import type { EloHistoryPlayer, EloHistoryPoint } from "@/lib/elo-history";

type EloHistoryChartProps = {
  players: EloHistoryPlayer[];
  chartData: EloHistoryPoint[];
  currentUserId?: string;
};

export default function EloHistoryChart({
  players,
  chartData,
  currentUserId,
}: EloHistoryChartProps) {
  if (!chartData.length || !players.length) {
    return (
      <div
        className={`${cardClassName} border-dashed text-center text-sm text-stone-500`}
      >
        No ELO history yet. Log matches to see ratings evolve.
      </div>
    );
  }

  return (
    <div className={`${cardClassName} p-4 pt-5`}>
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={chartData}
          margin={{ top: 8, right: 8, left: -12, bottom: 0 }}
        >
          <CartesianGrid
            strokeDasharray="3 3"
            stroke="rgba(120, 113, 108, 0.2)"
            vertical={false}
          />
          <XAxis
            dataKey="date"
            tick={{ fill: "#78716c", fontSize: 11 }}
            tickLine={false}
            axisLine={{ stroke: "rgba(120, 113, 108, 0.25)" }}
            interval="preserveStartEnd"
          />
          <YAxis
            domain={["auto", "auto"]}
            tick={{ fill: "#78716c", fontSize: 11 }}
            tickLine={false}
            axisLine={false}
            width={36}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "rgba(255, 255, 255, 0.96)",
              border: "1px solid rgba(231, 229, 228, 0.9)",
              borderRadius: "12px",
              fontSize: "13px",
              boxShadow: "0 8px 24px rgba(28, 25, 23, 0.08)",
            }}
            labelStyle={{ color: "#57534e", fontWeight: 600, marginBottom: 4 }}
            itemStyle={{ color: "#1c1917", paddingTop: 2 }}
          />
          <Legend
            wrapperStyle={{ fontSize: "12px", paddingTop: "12px" }}
            iconType="circle"
            iconSize={8}
          />
          {players.map((player) => (
            <Line
              key={player.userId}
              type="monotone"
              dataKey={player.name}
              stroke={player.color}
              strokeWidth={player.userId === currentUserId ? 3 : 2}
              dot={{ r: player.userId === currentUserId ? 4 : 3, fill: player.color }}
              activeDot={{ r: 5 }}
              connectNulls
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}
