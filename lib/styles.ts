/** Mature orange / stone palette — no bright multi-color accents */

const focusRing =
  "focus:border-orange-400/70 focus:outline-none focus:ring-4 focus:ring-orange-500/12 dark:focus:border-orange-600/60 dark:focus:ring-orange-600/15";

export const inputClassName =
  `w-full min-h-12 rounded-2xl border border-stone-200/90 bg-white px-4 py-3 text-[15px] text-stone-900 shadow-sm shadow-orange-950/5 transition-all placeholder:text-stone-400 ${focusRing} dark:border-stone-700/70 dark:bg-stone-900/90 dark:text-stone-50 dark:placeholder:text-stone-500`;

export const selectClassName =
  `w-full min-h-12 appearance-none rounded-2xl border border-stone-200/90 bg-white py-3 pl-4 pr-11 text-[15px] text-stone-900 shadow-sm shadow-orange-950/5 transition-all ${focusRing} dark:border-stone-700/70 dark:bg-stone-900/90 dark:text-stone-50`;

export const textareaClassName =
  `w-full rounded-2xl border border-stone-200/90 bg-white px-4 py-3 text-[15px] text-stone-900 shadow-sm shadow-orange-950/5 transition-all placeholder:text-stone-400 ${focusRing} dark:border-stone-700/70 dark:bg-stone-900/90 dark:text-stone-50 dark:placeholder:text-stone-500`;

export const labelClassName =
  "mb-2 block text-xs font-semibold uppercase tracking-wider text-stone-500 dark:text-stone-400";

export const cardClassName =
  "rounded-3xl border border-stone-200/80 bg-white/95 p-5 shadow-lg shadow-orange-950/5 backdrop-blur-sm dark:border-stone-800/70 dark:bg-stone-900/90 dark:shadow-black/25";

export const buttonPrimaryClassName =
  "inline-flex min-h-12 w-full items-center justify-center rounded-2xl bg-gradient-to-b from-orange-700 to-orange-900 px-5 py-3 text-[15px] font-semibold text-orange-50 shadow-lg shadow-orange-950/20 transition-all hover:from-orange-600 hover:to-orange-800 active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 dark:from-orange-600 dark:to-orange-800 dark:hover:from-orange-500 dark:hover:to-orange-700";

export const chipClassName =
  "inline-flex shrink-0 items-center rounded-full px-4 py-2 text-sm font-medium transition-all";

export const chipActiveClassName =
  "bg-orange-800 text-orange-50 shadow-md shadow-orange-950/15 dark:bg-orange-700";

export const chipInactiveClassName =
  "bg-white text-stone-600 shadow-sm ring-1 ring-stone-200/90 dark:bg-stone-800/80 dark:text-stone-300 dark:ring-stone-700/70";

/** Orange-only gradient borders (varying depth) */
export const gradientBorderAmber =
  "bg-gradient-to-br from-orange-300 via-orange-500 to-orange-700 p-[1px]";

export const gradientBorderSky =
  "bg-gradient-to-br from-orange-200 via-orange-400 to-orange-600 p-[1px]";

export const gradientBorderRose =
  "bg-gradient-to-br from-orange-500 via-orange-700 to-orange-900 p-[1px]";

export const gradientBorderViolet =
  "bg-gradient-to-br from-orange-600 via-orange-800 to-stone-900 p-[1px]";

export const gradientScoreBox =
  "bg-orange-50/80 ring-1 ring-orange-200/70 dark:bg-orange-950/25 dark:ring-orange-900/40";

export const gradientBadge =
  "bg-orange-50 text-orange-900 ring-1 ring-orange-200/80 dark:bg-orange-950/40 dark:text-orange-100 dark:ring-orange-900/50";

export const textAccent = "text-orange-800 dark:text-orange-400";

export const surfaceMuted =
  "bg-stone-100/80 dark:bg-stone-800/50";
