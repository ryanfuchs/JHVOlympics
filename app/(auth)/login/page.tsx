"use client";

import Link from "next/link";
import { useActionState } from "react";
import { signInAction, type AuthResult } from "@/app/(auth)/actions";
import LogoMark from "@/components/LogoMark";
import Alert from "@/components/ui/Alert";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import Input from "@/components/ui/Input";
import { textAccent } from "@/lib/styles";
import { APP_NAME, APP_SLOGAN } from "@/lib/branding";

const initialState: AuthResult = {};

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(signInAction, initialState);

  return (
    <div className="relative flex min-h-full flex-col items-center justify-center px-4 py-12">
      <div className="relative w-full max-w-sm space-y-6">
        <header className="text-center">
          <LogoMark size="lg" className="mx-auto mb-4" />
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-500">
            {APP_NAME}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Welcome back
          </h1>
          <p className="mt-2 text-[15px] italic text-zinc-500">{APP_SLOGAN}</p>
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
          <Link
            href="/signup"
            className={`font-semibold underline-offset-4 hover:underline ${textAccent}`}
          >
            Create one
          </Link>
        </p>
      </div>
    </div>
  );
}
