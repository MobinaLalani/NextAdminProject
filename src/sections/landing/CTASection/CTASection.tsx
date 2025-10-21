import React from "react";

function CTASection() {
  return (
    <section className="py-20 bg-blue-600 text-white">
      <div className="max-w-4xl mx-auto px-6 text-center">
        <h2 className="text-4xl md:text-5xl font-bold mb-6">
          آماده‌اید شروع کنید؟
        </h2>
        <p className="text-lg md:text-xl mb-8">
          همین حالا حساب کاربری خود را بسازید و از داشبورد مدیریت پیشرفته ما
          بهره‌مند شوید.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
            ثبت نام رایگان
          </button>
          <button className="bg-transparent border border-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition">
            اطلاعات بیشتر
          </button>
        </div>
      </div>
    </section>
  );
}

export default CTASection;
