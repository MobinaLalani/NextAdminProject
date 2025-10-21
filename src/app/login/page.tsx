"use client";

import React, { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { useUserStore } from "@/store/userStore";

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useUserStore(); // ✅ اضافه شد
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Login failed");
      }

      // ✅ ذخیره اطلاعات کاربر در Zustand
      setUser(data.user);

      // ✅ ذخیره در localStorage برای حفظ بعد از رفرش
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ انتقال به صفحه landing
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("خطایی رخ داد");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-8 rounded-2xl shadow-md w-80"
      >
        <h2 className="text-xl font-bold text-center mb-6">ورود</h2>

        <input
          type="text"
          placeholder="نام کاربری"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md"
        />

        <input
          type="password"
          placeholder="رمز عبور"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 mb-4 border rounded-md"
        />

        {error && <p className="text-red-500 text-sm mb-3">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-md transition"
        >
          {loading ? "در حال ورود..." : "تأیید"}
        </button>

        <p className="mt-4 text-center text-sm text-gray-600">
          حساب کاربری ندارید؟{" "}
          <button
            type="button"
            onClick={() => router.push("/signUp")}
            className="text-blue-600 hover:underline"
          >
            ثبت نام
          </button>
        </p>
      </form>
    </div>
  );
}
