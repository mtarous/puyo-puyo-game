"use client";

import React from "react";

export default function PharmacyFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer
      className="relative overflow-hidden"
      style={{
        background: "linear-gradient(180deg, #0c4a6e 0%, #0a3d5c 100%)",
      }}
    >
      {/* Decorative top wave */}
      <div className="absolute top-0 left-0 right-0">
        <svg viewBox="0 0 1440 40" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg" style={{ display: "block", transform: "scaleY(-1)" }}>
          <path
            d="M0,20 C240,40 480,0 720,16 C960,32 1200,8 1440,20 L1440,40 L0,40 Z"
            fill="white"
          />
        </svg>
      </div>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full"
          style={{
            width: 400,
            height: 400,
            bottom: "-200px",
            right: "-100px",
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto px-6 pt-20 pb-10 relative">
        {/* Main footer content */}
        <div className="grid md:grid-cols-3 gap-10 mb-12">
          {/* Brand */}
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "rgba(14,165,233,0.2)", border: "1px solid rgba(14,165,233,0.3)" }}
              >
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#38bdf8" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
                  <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
                </svg>
              </div>
              <div>
                <p className="text-white font-black text-lg">あおぞら薬局</p>
                <p className="text-sky-300 text-[10px] font-semibold tracking-widest">AOZORA PHARMACY</p>
              </div>
            </div>
            <p className="text-sky-200 text-sm leading-relaxed opacity-80">
              地域の皆様の健康を笑顔でサポートします。
              丁寧な服薬指導と親身な健康相談をご提供しています。
            </p>
            {/* Social-ish icons placeholder */}
            <div className="flex gap-3 mt-1">
              {["LINE", "Web"].map((label) => (
                <div
                  key={label}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold cursor-default"
                  style={{
                    background: "rgba(14,165,233,0.15)",
                    border: "1px solid rgba(14,165,233,0.25)",
                    color: "#7dd3fc",
                  }}
                >
                  {label}
                </div>
              ))}
            </div>
          </div>

          {/* Links */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-bold text-sm tracking-wide">ナビゲーション</p>
            <div className="flex flex-col gap-2.5">
              {[
                { label: "ホーム", id: "hero" },
                { label: "サービス一覧", id: "services" },
                { label: "営業時間", id: "hours" },
                { label: "アクセス・地図", id: "access" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    document.getElementById(item.id)?.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="text-sm text-sky-200 hover:text-white transition-colors duration-150 opacity-75 hover:opacity-100 flex items-center gap-2"
                >
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact summary */}
          <div className="flex flex-col gap-4">
            <p className="text-white font-bold text-sm tracking-wide">お問い合わせ</p>
            <div className="flex flex-col gap-3">
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                </svg>
                <span className="text-sky-100 text-sm font-semibold">03-XXXX-XXXX</span>
              </div>
              <div className="flex items-start gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mt-0.5 flex-shrink-0">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
                <span className="text-sky-200 text-sm opacity-80 leading-relaxed">
                  東京都〇〇区△△町 1-2-3<br />あおぞらビル 1F
                </span>
              </div>
              <div className="flex items-center gap-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#7dd3fc" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"/>
                  <polyline points="12 6 12 12 16 14"/>
                </svg>
                <span className="text-sky-200 text-sm opacity-80">月〜金 9:00〜19:00 / 土 9:00〜14:00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div
          className="w-full h-px mb-8"
          style={{ background: "rgba(125,211,252,0.15)" }}
        />

        {/* Bottom bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sky-300 text-xs opacity-60">
            © {currentYear} あおぞら薬局. All rights reserved.
          </p>
          <div className="flex gap-4">
            {["プライバシーポリシー", "サイトポリシー"].map((label) => (
              <span
                key={label}
                className="text-sky-300 text-xs opacity-50 hover:opacity-80 cursor-pointer transition-opacity"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
