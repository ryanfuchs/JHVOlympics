"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type AuthResult } from "@/app/(auth)/actions";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import Input from "@/components/ui/Input";

const initialState: AuthResult = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute left-1/2 top-24 h-48 w-48 -translate-x-1/2 rounded-full bg-gradient-to-br from-amber-400/30 via-rose-500/20 to-violet-500/30 blur-3xl" />

      <div className="relative w-full max-w-sm space-y-6">
        <header className="text-center">
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-amber-400 via-orange-500 to-rose-500 text-3xl shadow-xl shadow-orange-500/35">
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 to-white/25" />
            <span className="relative">🏅</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] gradient-text-subtle">
            JHV Olympics
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight gradient-text">
            Welcome back
          </h1>
          <p className="mt-2 text-[15px] text-zinc-500">
            Log in to track your competitions
          </p>
        </header>

        <Card accent="violet">
          <form action={formAction} className="space-y-4">
            <Field label="Email">
              <Input type="email" name="email" required autoComplete="email" />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                name="password"
                required
                autoComplete="current-password"
              />
            </Field>

            {state.error && <Alert>{state.error}</Alert>}

            <Button type="submit" disabled={pending}>
              {pending ? "Signing in…" : "Sign in"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-zinc-500">
          No account?{" "}
          <Link href="/signup" className="font-semibold gradient-text-subtle">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
