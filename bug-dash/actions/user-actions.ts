"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/session";
import { USER_ROLES } from "@/lib/constants";
import type { ActionResult, SafeUser } from "@/types";
import type { Role } from "@prisma/client";

export async function updateUserRole(
  userId: string,
  role: Role
): Promise<ActionResult<SafeUser>> {
  // 1. Auth + permission check
  await requireAdmin();

  // 2. Validate input
  if (!USER_ROLES.includes(role)) {
    return { ok: false, error: "Invalid role." };
  }

  // 3. Update, stripping the password before returning
  try {
    const user = await prisma.user.update({
      where: { id: userId },
      data: { role },
    });

    revalidatePath("/users");

    const { password, ...safeUser } = user;

    return { ok: true, data: safeUser };
  } catch (err: unknown) {
    // P2025 = record to update does not exist.
    if (
      typeof err === "object" &&
      err !== null &&
      "code" in err &&
      (err as { code: string }).code === "P2025"
    ) {
      return { ok: false, error: "User not found." };
    }

    console.error("updateUserRole failed:", err);
    return { ok: false, error: "Could not update user role. Please try again." };
  }
}
