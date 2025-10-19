// app/api/auth/register/route.ts
import { NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

interface User {
  id: number;
  username: string;
  email: string;
  password: string;
  role: string;
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, email, password, role } = body as {
      username?: string;
      email?: string;
      password?: string;
      role?: string;
    };

    if (!username || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "تمام فیلدها الزامی هستند" },
        { status: 400 }
      );
    }

    const filePath = path.join(process.cwd(), "mockUsers.json");

    try {
      await fs.access(filePath);
    } catch (accessErr) {

      await fs.writeFile(filePath, "[]", "utf-8");
    }


    const json = await fs.readFile(filePath, "utf-8");

    let users: User[] = [];
    try {
      users = JSON.parse(json) as User[];
      if (!Array.isArray(users)) {
        users = [];
      }
    } catch (parseErr) {
      console.error("parse error reading mockUsers.json:", parseErr);
      users = [];
    }

    const emailExists = users.some((u) => u.email === email);
    if (emailExists) {
      return NextResponse.json(
        { success: false, message: "ایمیل قبلا ثبت شده" },
        { status: 400 }
      );
    }

    const maxId = users.reduce((acc, u) => (u.id > acc ? u.id : acc), 0);
    const newUser: User = {
      id: maxId + 1,
      username,
      email,
      password,
      role,
    };

    users.push(newUser);

    await fs.writeFile(filePath, JSON.stringify(users, null, 2), "utf-8");

    return NextResponse.json({ success: true, user: newUser }, { status: 201 });
  } catch (err) {
    console.error("register error:", err);
    return NextResponse.json(
      { success: false, message: "خطا در ثبت نام — جزئیات در لاگ سرور" },
      { status: 500 }
    );
  }
}
