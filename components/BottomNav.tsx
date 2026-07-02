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
import { textAccent } from "@/lib/styles";

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t border-stone-200/90 bg-white/95 backdrop-blur-xl dark:border-stone-800/80 dark:bg-stone-950/95">
      <div className="pointer-events-none absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-orange-400/40 to-transparent" />
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
                <span className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-b from-orange-600 to-orange-800 text-white shadow-lg shadow-orange-950/25 ring-1 ring-orange-500/30">
                  <Icon size={22} strokeWidth={2.25} aria-hidden />
                </span>
                <span className={`text-[11px] font-semibold ${textAccent}`}>
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
                  ? textAccent
                  : "text-stone-400 dark:text-stone-500"
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
