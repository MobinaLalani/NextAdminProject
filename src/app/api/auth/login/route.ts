import { NextResponse } from "next/server";
import { mockUsers } from "@/lib/mockUsers";

export async function POST(req: Request) {
  const { username, password } = await req.json();

  const userData = mockUsers.find(
    (u) => u.username === username && u.password === password
  );

  if (!userData) {
    return NextResponse.json({ message: "invalidData" }, { status: 401 });
  }

  const token = "fake-jwt-token";

  const res = NextResponse.json({ success: true, message: "Logged in" });

  res.cookies.set("token", token, {
    httpOnly: true,
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
    sameSite: "lax",
  });

  return res;
}
