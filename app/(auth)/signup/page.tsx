"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signUpAction, type AuthResult } from "@/app/(auth)/actions";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import Input from "@/components/ui/Input";

const initialState: AuthResult = {};

export default function SignupPage() {
  const [state, formAction, pending] = useActionState(signUpAction, initialState);

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="pointer-events-none absolute right-8 top-20 h-40 w-40 rounded-full bg-gradient-to-br from-cyan-400/25 via-violet-500/20 to-rose-500/25 blur-3xl" />

      <div className="relative w-full max-w-sm space-y-6">
        <header className="text-center">
          <div className="relative mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-amber-400 text-3xl shadow-xl shadow-fuchsia-500/35">
            <span className="absolute inset-0 rounded-3xl bg-gradient-to-t from-black/10 to-white/25" />
            <span className="relative">🏆</span>
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] gradient-text-subtle">
            JHV Olympics
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight gradient-text">
            Join the league
          </h1>
          <p className="mt-2 text-[15px] text-zinc-500">
            Create an account to start logging games
          </p>
        </header>

        <Card accent="rose">
          <form action={formAction} className="space-y-4">
            <Field label="Display name">
              <Input type="text" name="displayName" required autoComplete="name" />
            </Field>

            <Field label="Email">
              <Input type="email" name="email" required autoComplete="email" />
            </Field>

            <Field label="Password">
              <Input
                type="password"
                name="password"
                required
                minLength={6}
                autoComplete="new-password"
              />
            </Field>

            {state.error && <Alert>{state.error}</Alert>}

            <Button type="submit" disabled={pending}>
              {pending ? "Creating account…" : "Create account"}
            </Button>
          </form>
        </Card>

        <p className="text-center text-sm text-zinc-500">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold gradient-text-subtle">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
