"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  List,
  Plus,
  Trophy,
  User,
  type LucideIcon,
} from "lucide-react";

type NavItem = {
  href: string;
  label: string;
  icon: LucideIcon;
  highlight?: boolean;
};

const navItems: NavItem[] = [
  { href: "/", label: "Home", icon: Home },
  { href: "/matches", label: "Matches", icon: List },
  { href: "/matches/new", label: "Log", icon: Plus, highlight: true },
  { href: "/leaderboard", label: "Ranks", icon: Trophy },
  { href: "/profile", label: "Profile", icon: User },
];

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-white/20 bg-gradient-to-t from-white/95 via-white/85 to-white/70 backdrop-blur-2xl dark:border-zinc-700/30 dark:from-zinc-950/95 dark:via-zinc-950/85 dark:to-zinc-950/70">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-zinc-400/40 to-transparent dark:via-zinc-500/30" />
      <div className="mx-auto flex max-w-lg items-end justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-1">
        {navItems.map((item) => {
          const isActive =
            item.href === "/"
              ? pathname === "/"
              : pathname.startsWith(item.href) &&
                !(item.href === "/matches" && pathname === "/matches/new");

          const Icon = item.icon;

          if (item.highlight) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className="-mt-5 flex min-w-[3.5rem] flex-1 flex-col items-center gap-1"
              >
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 text-white shadow-lg shadow-zinc-900/30 ring-1 ring-white/10 dark:from-zinc-100 dark:to-zinc-300 dark:text-zinc-900">
                  <Icon size={22} strokeWidth={2.25} aria-hidden />
                </span>
                <span className="text-[11px] font-semibold text-zinc-700 dark:text-zinc-300">
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
              <Icon
                size={20}
                strokeWidth={isActive ? 2.25 : 2}
                aria-hidden
              />
              <span className="text-[11px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
