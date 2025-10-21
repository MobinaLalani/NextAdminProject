import React from "react";

function HowItWorksSection() {
  const steps = [
    {
      title: "ثبت نام آسان",
      description: "در کمتر از چند دقیقه حساب کاربری خود را ایجاد کنید.",
      icon: "📝",
    },
    {
      title: "افزودن اطلاعات",
      description: "سفارش‌ها، مشتری‌ها و اطلاعات کسب‌وکار خود را وارد کنید.",
      icon: "📦",
    },
    {
      title: "مدیریت و گزارش",
      description: "همه آمار و گزارش‌ها را در داشبورد مشاهده کنید.",
      icon: "📊",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-6 text-center">
        <h2 className="text-3xl font-bold mb-10 text-gray-800">
          چگونه کار می‌کند
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map((step, index) => (
            <div
              key={index}
              className="bg-white p-8 rounded-2xl shadow hover:shadow-lg transition"
            >
              <div className="text-5xl mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HowItWorksSection;
