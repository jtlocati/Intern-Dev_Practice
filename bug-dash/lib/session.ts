import { redirect } from "next/navigation";
import { auth } from "@/lib/auth";
import type { SessionUser } from "@/types";
import { Session } from "inspector/promises";

export async function getCurrentUser(): Promise<SessionUser | null> {
    const session = await auth();
    if (!session?.user){
        return null;
    }
    return {id: session.user.id, name: session.user.name ?? "", email: session.user.email ?? "", role: session.user.role,};
}

export async function requireUser(): Promise<SessionUser> {
    const user = await getCurrentUser();
    if (!user){
        redirect("/login")
    }
    return user;
}

export async function requireAdmin(): Promise<SessionUser> {
    const user = await requireUser();
    if (user.role !== "ADMIN"){
        redirect("/unauthorized")
    }
    return user;
}