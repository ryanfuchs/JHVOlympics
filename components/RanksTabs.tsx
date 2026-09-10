"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  chipActiveClassName,
  chipClassName,
  chipInactiveClassName,
} from "@/lib/styles";

const tabs = [
  { href: "/leaderboard", label: "Players" },
  { href: "/leaderboard/duos", label: "Duos" },
  { href: "/leaderboard/seasons", label: "Seasons" },
];

export default function RanksTabs() {
  const pathname = usePathname();

  return (
    <div className="grid gap-2 rounded-2xl bg-stone-100/90 p-1.5 ring-1 ring-stone-200/80 dark:bg-stone-800/90 dark:ring-stone-700/50">
      <div className="grid grid-cols-3 gap-1.5">
        {tabs.map((tab) => {
          const isActive =
            tab.href === "/leaderboard"
              ? pathname === "/leaderboard"
              : pathname.startsWith(tab.href);

          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={`${chipClassName} min-h-11 justify-center rounded-xl ${
                isActive ? chipActiveClassName : chipInactiveClassName
              }`}
            >
              {tab.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
