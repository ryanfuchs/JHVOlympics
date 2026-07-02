function missingEnvMessage(name: string): string {
  return `Missing ${name}. Copy .env.local.example to .env.local and add your Supabase credentials.`;
}

export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  if (!url) {
    throw new Error(missingEnvMessage("NEXT_PUBLIC_SUPABASE_URL"));
  }
  return url;
}

/** Supports legacy anon key and newer Supabase publishable key env names. */
export function getSupabaseAnonKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!key) {
    throw new Error(
      missingEnvMessage(
        "NEXT_PUBLIC_SUPABASE_ANON_KEY (or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY)"
      )
    );
  }

  return key;
}
