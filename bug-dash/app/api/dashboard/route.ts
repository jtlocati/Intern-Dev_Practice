import { NextResponse } from "next/server";
import { getDashboardStats } from "@/data/dashboard";

// GET /api/dashboard — aggregated dashboard stats, scoped to the current user.
export async function GET() {
  try {
    const stats = await getDashboardStats();
    return NextResponse.json(stats);
  } catch (err) {
    console.error("GET /api/dashboard failed:", err);
    return NextResponse.json(
      { error: "Could not load dashboard stats." },
      { status: 500 }
    );
  }
}
