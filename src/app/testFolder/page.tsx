"use client";

import React, { useState, useRef } from "react";

declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export default function VoicePage() {
  const [text, setText] = useState("");
  const recognitionRef = useRef<any>(null);

  // 🎤 شروع ضبط
  const startListening = () => {
    const SpeechRecognition =
      window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("مرورگر شما از تشخیص صدا پشتیبانی نمی‌کند!");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = "fa-IR";
    recognition.continuous = true;
    recognition.interimResults = false; // فقط نتیجه نهایی هر بار ضبط

    let tempTranscript = "";

    recognition.onresult = (event: any) => {
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          tempTranscript += event.results[i][0].transcript + " ";
        }
      }
    };

    recognition.onend = () => {
      if (tempTranscript.trim()) {
        // 🔹 وقتی ضبط تموم شد، متن جدید به قبلی اضافه میشه
        setText((prev) => (prev ? prev + " " + tempTranscript.trim() : tempTranscript.trim()));
      }
    };

    recognition.onerror = (e: any) => {
      console.error("Speech error:", e);
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // 🛑 توقف ضبط
  const stopListening = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop();
      recognitionRef.current = null;
    }
  };

  // 🧹 پاک کردن همه‌ی متن‌ها
  const clearAll = () => {
    setText("");
  };

  return (
    <div style={{ padding: "40px", textAlign: "center", direction: "rtl" }}>
      <h1>🎙️ تبدیل گفتار به نوشتار (با افزودن خودکار)</h1>

      <div style={{ display: "flex", justifyContent: "center", gap: "10px", marginBottom: "20px" }}>
        <button
          onMouseDown={startListening}
          onMouseUp={stopListening}
          onTouchStart={startListening}
          onTouchEnd={stopListening}
          style={{
            padding: "14px 28px",
            fontSize: "16px",
            borderRadius: "50px",
            backgroundColor: "#1890ff",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          🎤 نگه دار برای ضبط
        </button>

        <button
          onClick={clearAll}
          style={{
            padding: "14px 20px",
            fontSize: "16px",
            borderRadius: "50px",
            backgroundColor: "#ff4d4f",
            color: "#fff",
            border: "none",
            cursor: "pointer",
          }}
        >
          🧹 پاک کردن همه
        </button>
      </div>

      <div
        style={{
          marginTop: "20px",
          padding: "20px",
          border: "1px solid #ccc",
          borderRadius: "12px",
          minHeight: "150px",
          fontSize: "18px",
          lineHeight: "1.8",
          textAlign: "right",
          backgroundColor: "#fafafa",
          whiteSpace: "pre-wrap",
        }}
      >
        {text || "دکمه را نگه دارید و صحبت کنید..."}
      </div>
    </div>
  );
}
