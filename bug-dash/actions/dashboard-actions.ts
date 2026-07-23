"use server";

import { getDashboardStats } from "@/data/dashboard";
import type { ActionResult, DashStats } from "@/types";

export async function getDashboardStatsAction(): Promise<
  ActionResult<DashStats>
> {
  try {
    const data = await getDashboardStats();
    return { ok: true, data };
  } catch (err) {
    console.error("getDashboardStatsAction failed:", err);
    return { ok: false, error: "Could not load dashboard stats." };
  }
}
