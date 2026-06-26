"use client";

import React from "react";

const services = [
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
        <line x1="16" y1="13" x2="8" y2="13"/>
        <line x1="16" y1="17" x2="8" y2="17"/>
        <polyline points="10 9 9 9 8 9"/>
      </svg>
    ),
    title: "調剤薬局",
    desc: "処方せんを受け付け、正確・迅速にお薬をご用意します。服薬の説明も丁寧に行います。",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.07)",
    border: "rgba(14,165,233,0.2)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    ),
    title: "健康相談",
    desc: "薬剤師が丁寧にお答えします。お薬のこと、症状のこと、何でもお気軽にどうぞ。",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.07)",
    border: "rgba(236,72,153,0.2)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="9" cy="21" r="1"/>
        <circle cx="20" cy="21" r="1"/>
        <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
      </svg>
    ),
    title: "市販薬・OTC",
    desc: "風邪薬・胃腸薬・栄養補助食品など、豊富な市販薬を取り揃えております。",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.07)",
    border: "rgba(245,158,11,0.2)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
        <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
      </svg>
    ),
    title: "お薬手帳",
    desc: "電子お薬手帳にも対応。お薬の情報を一元管理して安全な服薬をサポートします。",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.07)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <rect x="1" y="3" width="15" height="13" rx="2"/>
        <path d="M16 8h4l3 3v5h-7V8z"/>
        <circle cx="5.5" cy="18.5" r="2.5"/>
        <circle cx="18.5" cy="18.5" r="2.5"/>
      </svg>
    ),
    title: "宅配サービス",
    desc: "ご自宅へお薬をお届けします。外出が難しい方や忙しい方もご安心ください。",
    color: "#0d9488",
    bg: "rgba(13,148,136,0.07)",
    border: "rgba(13,148,136,0.2)",
  },
  {
    icon: (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <polyline points="9 12 11 14 15 10"/>
      </svg>
    ),
    title: "予防接種情報",
    desc: "インフルエンザ・コロナなどのワクチン情報や近隣接種機関のご案内をしています。",
    color: "#10b981",
    bg: "rgba(16,185,129,0.07)",
    border: "rgba(16,185,129,0.2)",
  },
];

export default function ServicesSection() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-14">
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold mb-4"
            style={{
              background: "rgba(14,165,233,0.08)",
              border: "1.5px solid rgba(14,165,233,0.2)",
              color: "#0369a1",
            }}
          >
            OUR SERVICES
          </div>
          <h2
            className="text-3xl md:text-4xl font-black mb-4"
            style={{ color: "#0c4a6e" }}
          >
            私たちのサービス
          </h2>
          <p className="text-slate-400 text-base max-w-md mx-auto leading-relaxed">
            地域の皆様の健康を、多様なサービスで幅広くサポートします
          </p>
        </div>

        {/* Service cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service.title}
              className="group relative p-6 rounded-2xl transition-all duration-300 hover:-translate-y-1 cursor-default"
              style={{
                background: "white",
                border: `1.5px solid ${service.border}`,
                boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = `0 12px 40px rgba(0,0,0,0.08), 0 0 0 1px ${service.border}`;
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 20px rgba(0,0,0,0.04)";
              }}
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform duration-200 group-hover:scale-110"
                style={{ background: service.bg, color: service.color }}
              >
                {service.icon}
              </div>

              {/* Title */}
              <h3
                className="text-lg font-black mb-2"
                style={{ color: "#0c4a6e" }}
              >
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-slate-400 leading-relaxed">
                {service.desc}
              </p>

              {/* Bottom accent line */}
              <div
                className="absolute bottom-0 left-6 right-6 h-0.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: `linear-gradient(90deg, ${service.color}, transparent)` }}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
