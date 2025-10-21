import React from "react";

function HeroSection() {
  return (
    <section className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white py-24 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-6">
          به داشبورد مدیریت ما خوش آمدید
        </h1>
        <p className="text-lg md:text-xl mb-8">
          همه ابزارهای مدیریت کسب‌وکار خود را در یک مکان داشته باشید. سفارش‌ها،
          مشتری‌ها، گزارش‌ها و آمار همه در دسترس شماست.
        </p>
        <div className="flex justify-center gap-4">
          <button className="bg-white text-blue-600 font-semibold px-6 py-3 rounded-lg shadow-md hover:bg-gray-100 transition">
            شروع کنید
          </button>
          <button className="bg-transparent border border-white font-semibold px-6 py-3 rounded-lg hover:bg-white hover:text-blue-600 transition">
            بیشتر بدانید
          </button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;
