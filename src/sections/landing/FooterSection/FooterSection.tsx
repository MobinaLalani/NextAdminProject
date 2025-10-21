import React from "react";
import Link from "next/link";

function FooterSection() {
  return (
    <footer className="bg-gray-800 text-gray-200 py-12">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* بخش درباره ما */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">درباره ما</h3>
          <p className="text-gray-400">
            ما یک داشبورد مدیریت پیشرفته ارائه می‌دهیم که همه ابزارهای کسب‌وکار
            شما را در یک مکان جمع می‌کند.
          </p>
        </div>

        {/* بخش لینک‌ها */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">لینک‌های سریع</h3>
          <ul className="space-y-2">
            <li>
              <Link href="/" className="hover:text-white transition">
                خانه
              </Link>
            </li>
            <li>
              <Link href="/dashboard" className="hover:text-white transition">
                داشبورد
              </Link>
            </li>
            <li>
              <Link href="/profile" className="hover:text-white transition">
                پروفایل
              </Link>
            </li>
            <li>
              <Link href="/contact" className="hover:text-white transition">
                تماس با ما
              </Link>
            </li>
          </ul>
        </div>

        {/* بخش شبکه‌های اجتماعی */}
        <div>
          <h3 className="text-xl font-bold mb-4 text-white">
            ما را دنبال کنید
          </h3>
          <div className="flex gap-4">
            <a href="#" className="hover:text-white transition">
              🌐
            </a>
            <a href="#" className="hover:text-white transition">
              🐦
            </a>
            <a href="#" className="hover:text-white transition">
              📘
            </a>
            <a href="#" className="hover:text-white transition">
              📸
            </a>
          </div>
        </div>
      </div>

      <div className="mt-12 text-center text-gray-500 text-sm">
        © 2025 MyApp. همه حقوق محفوظ است.
      </div>
    </footer>
  );
}

export default FooterSection;
