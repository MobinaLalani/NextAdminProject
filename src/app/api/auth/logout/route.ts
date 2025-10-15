import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function POST(req: NextRequest) {
  const res = NextResponse.json({ success: true, message: "Logged out" });
  res.cookies.delete("token");
  return res;
}
