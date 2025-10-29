"use client";

import React, { useState } from "react";

// ۱️⃣ به window یه نوع اضافه می‌کنیم
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoicePage() {
  const [text, setText] = useState("");

  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert("مرورگر شما از Speech Recognition پشتیبانی نمی‌کند!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fa-IR";
    recognition.continuous = true;

    recognition.onresult = (event: any) => {
      const transcript = Array.from(event.results)
        .map((result: any) => result[0].transcript)
        .join("");
      setText(transcript);
    };

    recognition.start();
  };
 console.log('text',text)
  return (
    <div style={{ padding: "40px", textAlign: "center" }}>
      <h1>تبدیل صدا به متن فارسی</h1>
      <button
        onClick={startListening}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          fontSize: "16px",
          cursor: "pointer",
        }}
      >
        شروع ضبط
      </button>
      <div
        style={{
          marginTop: "30px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "8px",
          minHeight: "100px",
        }}
      >
        {text || "متن شما اینجا نمایش داده می‌شود..."}
      </div>
    </div>
  );
}
