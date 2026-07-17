import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/session";
import LoginForm from "./login-form";

export default async function Login() {
  const user = await getCurrentUser();
  if (user){
    redirect("/dashboard")
  }
  return(
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-sm">
        <h1 className="mb-6 text-2xl font-semibold">Sign in</h1>
        <LoginForm />
      </div>
    </main>
  )
}