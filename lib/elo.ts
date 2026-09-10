/**
 * ELO constants shared by the UI.
 *
 * The rating algorithm itself lives in Postgres (`apply_match_elo` /
 * `recalculate_all_elo`, see supabase/migrations/007_elo_fixes.sql) and is the
 * single source of truth. Ratings are path-dependent and re-derived by replaying
 * every match in `played_at` order, which is not something the client can or
 * should reproduce — don't reimplement the formula here.
 */

export const DEFAULT_ELO = 1000;
export const ELO_K_FACTOR = 32;
