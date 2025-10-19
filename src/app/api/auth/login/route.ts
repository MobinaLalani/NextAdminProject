import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

// تعریف نوع کاربر
interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    const { username, password } = await req.json();

    if (!username || !password) {
      return NextResponse.json(
        { message: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "mockUsers.json");
    const json = await fs.readFile(filePath, "utf-8");
    const users: User[] = JSON.parse(json);

    // پیدا کردن کاربر
    const userData = users.find(
      (u) => u.username === username && u.password === password
    );

    if (!userData) {
      return NextResponse.json(
        { message: "نام کاربری یا رمز اشتباه است" },
        { status: 401 }
      );
    }

    const token = "fake-jwt-token";

    const res = NextResponse.json({
      success: true,
      message: "ورود موفق",
      user: {
        id: userData.id,
        username: userData.username,
        role: userData.role,
      },
    });

    res.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
      sameSite: "lax",
    });

    return res;
  } catch (err) {
    return NextResponse.json({ message: "خطا در ورود" }, { status: 500 });
  }
}
