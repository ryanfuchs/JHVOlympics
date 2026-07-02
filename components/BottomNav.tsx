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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-zinc-200 bg-white/95 backdrop-blur dark:border-zinc-800 dark:bg-zinc-950/95">
      <div className="mx-auto flex max-w-lg items-stretch justify-around px-2 pb-[env(safe-area-inset-bottom)]">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) &&
                !(item.href === "/matches" && pathname === "/matches/new");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex min-h-14 min-w-[3.5rem] flex-1 flex-col items-center justify-center gap-0.5 text-xs transition-colors ${
                item.highlight
                  ? isActive
                    ? "text-amber-600 dark:text-amber-400"
                    : "text-amber-500 dark:text-amber-400"
                  : isActive
                    ? "text-zinc-900 dark:text-white"
                    : "text-zinc-500 dark:text-zinc-400"
              }`}
            >
              <span className="text-lg leading-none">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
