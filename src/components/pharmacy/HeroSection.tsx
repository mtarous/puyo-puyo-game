"use client";

import React from "react";

export default function HeroSection() {
  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #e0f2fe 0%, #f0fdf4 45%, #ecfeff 100%)",
      }}
    >
      {/* Decorative background circles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div
          className="absolute rounded-full animate-pharmacy-float-a"
          style={{
            width: 600,
            height: 600,
            top: "-200px",
            right: "-150px",
            background: "radial-gradient(circle, rgba(14,165,233,0.10) 0%, rgba(14,165,233,0.03) 50%, transparent 70%)",
          }}
        />
        <div
          className="absolute rounded-full animate-pharmacy-float-b"
          style={{
            width: 400,
            height: 400,
            bottom: "-100px",
            left: "-80px",
            background: "radial-gradient(circle, rgba(16,185,129,0.10) 0%, rgba(16,185,129,0.03) 50%, transparent 70%)",
          }}
        />
        {/* Small bubbles */}
        <div
          className="absolute rounded-full animate-pharmacy-float-a"
          style={{
            width: 90,
            height: 90,
            top: "22%",
            right: "12%",
            background: "rgba(14,165,233,0.07)",
            border: "1.5px solid rgba(14,165,233,0.18)",
          }}
        />
        <div
          className="absolute rounded-full animate-pharmacy-float-b"
          style={{
            width: 55,
            height: 55,
            top: "65%",
            left: "8%",
            background: "rgba(16,185,129,0.08)",
            border: "1.5px solid rgba(16,185,129,0.2)",
          }}
        />
        <div
          className="absolute rounded-full animate-pharmacy-float-a"
          style={{
            width: 36,
            height: 36,
            top: "42%",
            left: "5%",
            background: "rgba(14,165,233,0.1)",
            border: "1.5px solid rgba(14,165,233,0.2)",
          }}
        />
        {/* Plus symbols */}
        <div
          className="absolute font-black text-sky-200 animate-pharmacy-float-b select-none"
          style={{ top: "28%", right: "28%", fontSize: 56, lineHeight: 1, opacity: 0.5 }}
        >
          +
        </div>
        <div
          className="absolute font-black text-emerald-200 animate-pharmacy-float-a select-none"
          style={{ bottom: "32%", left: "18%", fontSize: 36, lineHeight: 1, opacity: 0.6 }}
        >
          +
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-24 pb-20 w-full">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          {/* Left: Text content */}
          <div className="flex flex-col gap-7">
            {/* Badge */}
            <div
              className="inline-flex items-center gap-2 w-fit px-4 py-2 rounded-full text-sm font-bold animate-fade-in"
              style={{
                background: "rgba(14,165,233,0.09)",
                border: "1.5px solid rgba(14,165,233,0.22)",
                color: "#0369a1",
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              地域に根ざした調剤薬局
            </div>

            {/* Heading */}
            <h1
              className="text-4xl md:text-5xl font-black leading-[1.2] animate-slide-up"
              style={{ color: "#0c4a6e", animationDelay: "0.1s" }}
            >
              笑顔で寄り添う、
              <br />
              <span
                style={{
                  background: "linear-gradient(135deg, #0ea5e9 0%, #0d9488 50%, #10b981 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                あなたの街の薬局
              </span>
            </h1>

            {/* Subtitle */}
            <p
              className="text-base text-slate-500 leading-relaxed max-w-md animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              丁寧な服薬指導と親身な健康相談で、
              地域の皆様の健康を長年にわたりサポートしています。
              処方せんはもちろん、ちょっとした健康の悩みもお気軽にご相談ください。
            </p>

            {/* CTA buttons */}
            <div
              className="flex flex-wrap gap-3 animate-slide-up"
              style={{ animationDelay: "0.3s" }}
            >
              <a
                href="#hours"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("hours")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-white text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
                  boxShadow: "0 8px 30px rgba(14,165,233,0.35)",
                }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
                  <polyline points="14 2 14 8 20 8"/>
                </svg>
                処方せんをお持ちの方
              </a>
              <a
                href="#services"
                onClick={(e) => {
                  e.preventDefault();
                  document.getElementById("services")?.scrollIntoView({ behavior: "smooth" });
                }}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-full font-bold text-sm transition-all duration-200 hover:scale-105 active:scale-95"
                style={{
                  background: "white",
                  border: "2px solid #0ea5e9",
                  color: "#0ea5e9",
                  boxShadow: "0 4px 15px rgba(14,165,233,0.12)",
                }}
              >
                サービス案内
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </a>
            </div>

            {/* Stats */}
            <div
              className="flex gap-8 pt-2 animate-slide-up"
              style={{ animationDelay: "0.4s" }}
            >
              {[
                { num: "20年+", label: "地域の信頼" },
                { num: "年中無休", label: "処方せん対応" },
                { num: "相談無料", label: "健康サポート" },
              ].map((s) => (
                <div key={s.label} className="flex flex-col gap-0.5">
                  <span className="text-xl font-black" style={{ color: "#0ea5e9" }}>{s.num}</span>
                  <span className="text-xs font-medium text-slate-400">{s.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Visual card */}
          <div className="relative flex items-center justify-center">
            {/* Main card */}
            <div
              className="relative w-72 h-72 md:w-80 md:h-80 rounded-[2.5rem] flex items-center justify-center animate-slide-up"
              style={{
                background: "linear-gradient(135deg, rgba(14,165,233,0.08), rgba(16,185,129,0.08))",
                border: "1.5px solid rgba(14,165,233,0.18)",
                boxShadow: "0 24px 80px rgba(14,165,233,0.12)",
                animationDelay: "0.2s",
              }}
            >
              {/* Center icon */}
              <div
                className="w-28 h-28 rounded-3xl flex items-center justify-center"
                style={{
                  background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
                  boxShadow: "0 20px 60px rgba(14,165,233,0.4)",
                }}
              >
                <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="3" ry="3"/>
                  <line x1="12" y1="8" x2="12" y2="16"/>
                  <line x1="8" y1="12" x2="16" y2="12"/>
                </svg>
              </div>

              {/* Floating badge: 受付中 */}
              <div
                className="absolute -top-5 -right-5 px-4 py-2 rounded-2xl text-xs font-bold animate-pharmacy-float-b"
                style={{
                  background: "white",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
                  color: "#059669",
                  border: "1.5px solid rgba(16,185,129,0.2)",
                }}
              >
                ✓ 処方せん受付中
              </div>

              {/* Floating badge: 相談 */}
              <div
                className="absolute -bottom-5 -left-5 px-4 py-2 rounded-2xl text-xs font-bold animate-pharmacy-float-a"
                style={{
                  background: "white",
                  boxShadow: "0 8px 30px rgba(0,0,0,0.10)",
                  color: "#0ea5e9",
                  border: "1.5px solid rgba(14,165,233,0.2)",
                }}
              >
                🌿 健康相談 無料
              </div>

              {/* Decorative ring */}
              <div
                className="absolute -inset-6 rounded-[3rem]"
                style={{
                  border: "1.5px dashed rgba(14,165,233,0.15)",
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 64" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block" }}>
          <path
            d="M0,40 C240,80 480,0 720,32 C960,64 1200,16 1440,40 L1440,64 L0,64 Z"
            fill="white"
          />
        </svg>
      </div>
    </section>
  );
}
