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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-gradient-to-t from-white/95 via-white/85 to-white/70 backdrop-blur-2xl dark:border-zinc-700/30 dark:from-zinc-950/95 dark:via-zinc-950/85 dark:to-zinc-950/70">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-amber-400/50 to-transparent" />
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
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-2xl shadow-lg shadow-orange-500/40 transition-transform active:scale-95">
                  <span className="absolute inset-0 rounded-2xl bg-gradient-to-t from-black/10 to-white/20" />
                  <span className="relative">{item.icon}</span>
                </span>
                <span className="text-[11px] font-semibold gradient-text-subtle">
                  {item.label}
                </span>
              </Link>
            );
          }

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-1 rounded-xl transition-all ${
                isActive
                  ? "text-zinc-900 dark:text-white"
                  : "text-zinc-400 dark:text-zinc-500"
              }`}
            >
              <span
                className={`text-xl leading-none ${isActive ? "drop-shadow-sm" : ""}`}
              >
                {item.icon}
              </span>
              <span
                className={`text-[11px] font-medium ${isActive ? "gradient-text-subtle" : ""}`}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
