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
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-b from-amber-400 to-amber-600 text-3xl shadow-lg shadow-amber-600/30">
            🏅
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            JHV Olympics
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Welcome back</h1>
          <p className="mt-2 text-[15px] text-zinc-500">
            Log in to track your competitions
          </p>
        </header>

        <Card>
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
          <Link
            href="/signup"
            className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
