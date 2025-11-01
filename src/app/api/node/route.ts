import { NextResponse } from "next/server";
import pool from "@/lib/db";

// ...existing code...
export async function GET() {
  try {
    const [rows] = await pool.query("SELECT * FROM nodes");
    return NextResponse.json(rows);
  } catch (err) {
    console.error("API /api/node error:", err);
    return NextResponse.json({ error: "Database error" }, { status: 500 });
  }
}