import React from "react";

function TestimonialsSection() {
  const testimonials = [
    {
      name: "علی رضایی",
      role: "مدیر شرکت",
      message:
        "داشبورد شما باعث شد کارهایم بسیار سریع‌تر و سازمان‌یافته‌تر انجام شود.",
    },
    {
      name: "مریم احمدی",
      role: "کارشناس فروش",
      message:
        "رابط کاربری ساده و گزارش‌های دقیق باعث شد تصمیم‌گیری‌های بهتری داشته باشیم.",
    },
    {
      name: "حسین کاظمی",
      role: "توسعه‌دهنده",
      message:
        "ادغام سریع با سیستم‌های موجود و دسترسی آسان به داده‌ها فوق‌العاده است.",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-12 text-gray-800">
          نظرات کاربران ما
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((t, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
            >
              <p className="text-gray-600 mb-4">{t.message}</p>
              <h3 className="text-lg font-semibold text-gray-800">{t.name}</h3>
              <p className="text-gray-500 text-sm">{t.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default TestimonialsSection;
