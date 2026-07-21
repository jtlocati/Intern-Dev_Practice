'use client';
import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import  { loginAction } from "@/actions/auth-actions";
import { stat } from "fs";

export default function LoginForm() {
  const router = useRouter();
  const [state, formaction, pending] = useActionState(loginAction, null);

  useEffect(() => {
    if (state?.ok){
      router.push("/dashboard")
    }
  }, [state, router])

  const errors = state?.ok === false ? state: null;

  return(
    <form action={formaction} className="space-y-4">
      <div>
        <label htmlFor="email" className="mb-1 block text-sm font-medium">Email</label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {errors?.fieldErrors?.email?.[0] && (
          <p className="mt-1 text-sm text-red-600">{errors.fieldErrors.email[0]}</p>
        )}
      </div>

      <div>
        <label htmlFor="password" className="mb-1 block text-sm font-medium">Password</label>
        <input
          id="password"
          name="password"
          type="password"
          autoComplete="current-password"
          className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
        />
        {errors?.fieldErrors?.password?.[0] && (
          <p className="mt-1 text-sm text-red-600">{errors.fieldErrors.password[0]}</p>
        )}
      </div>

      {errors && !errors.fieldErrors && (
        <p className="text-sm text-red-600">{errors.error}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-md bg-blue-600 px-3 py-2 text-sm font-medium text-white disabled:opacity-50"
      >
        {pending ? "Signing in..." : "Sign in"}
      </button>
    </form>
  )
}