"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navItems = [
  { href: "/", label: "Home", icon: "🏠" },
  { href: "/matches", label: "Matches", icon: "📋" },
  { href: "/matches/new", label: "Log", icon: "➕", highlight: true },
  { href: "/leaderboard", label: "Ranks", icon: "🏅" },
  { href: "/profile", label: "Profile", icon: "👤" },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200/80 bg-white/90 backdrop-blur-xl dark:border-zinc-800/80 dark:bg-zinc-950/90">
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) &&
                !(item.href === "/matches" && pathname === "/matches/new");

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-5 flex min-w-[3.5rem] flex-1 flex-col items-center gap-1"
              >
                <span
                  className={`flex h-14 w-14 items-center justify-center rounded-2xl text-2xl shadow-lg transition-transform active:scale-95 ${
                    isActive
                      ? "bg-gradient-to-b from-amber-400 to-amber-600 shadow-amber-600/30"
                      : "bg-gradient-to-b from-amber-400 to-amber-600 shadow-amber-600/25"
                  }`}
                >
                  {item.icon}
                </span>
                <span className="text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl transition-colors ${
                isActive
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              <span className="text-xl leading-none">{item.icon}</span>
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
