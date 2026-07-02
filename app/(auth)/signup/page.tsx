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
    <div className="flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm space-y-6">
        <header className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-b from-amber-400 to-amber-600 text-3xl shadow-lg shadow-amber-600/30">
            🏆
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-amber-600">
            JHV Olympics
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight">Join the league</h1>
          <p className="mt-2 text-[15px] text-zinc-500">
            Create an account to start logging games
          </p>
        </header>

        <Card>
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
          <Link
            href="/login"
            className="font-semibold text-amber-600 hover:text-amber-700 dark:text-amber-400"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
