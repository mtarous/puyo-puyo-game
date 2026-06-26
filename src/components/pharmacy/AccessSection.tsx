import React from "react";

export default function AccessSection() {
  return (
    <section id="access" className="py-24 bg-white">
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
            ACCESS
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "#0c4a6e" }}>
            アクセス
          </h2>
          <p className="text-slate-400 text-base">
            駅から徒歩5分、お気軽にご来店ください
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-10 items-start">
          {/* Map placeholder */}
          <div
            className="w-full aspect-video rounded-2xl overflow-hidden flex items-center justify-center relative"
            style={{
              background: "linear-gradient(135deg, #e0f2fe, #dcfce7)",
              border: "1.5px solid rgba(14,165,233,0.15)",
              boxShadow: "0 8px 40px rgba(14,165,233,0.08)",
              minHeight: 280,
            }}
          >
            {/* Map illustration */}
            <div className="flex flex-col items-center gap-3 text-center">
              <div
                className="w-16 h-16 rounded-2xl flex items-center justify-center"
                style={{ background: "linear-gradient(135deg, #0ea5e9, #0d9488)" }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                  <circle cx="12" cy="10" r="3"/>
                </svg>
              </div>
              <div>
                <p className="text-sm font-bold" style={{ color: "#0c4a6e" }}>あおぞら薬局</p>
                <p className="text-xs text-slate-400 mt-0.5">地図を表示するにはAPIキーが必要です</p>
              </div>
            </div>

            {/* Grid overlay for map feel */}
            <div
              className="absolute inset-0 opacity-20"
              style={{
                backgroundImage: "linear-gradient(rgba(14,165,233,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(14,165,233,0.3) 1px, transparent 1px)",
                backgroundSize: "40px 40px",
              }}
            />
          </div>

          {/* Info panel */}
          <div className="flex flex-col gap-5">
            {[
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/>
                    <circle cx="12" cy="10" r="3"/>
                  </svg>
                ),
                label: "所在地",
                value: "〒000-0000\n東京都〇〇区△△町 1-2-3\nあおぞらビル 1F",
                color: "#0ea5e9",
                bg: "rgba(14,165,233,0.08)",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                ),
                label: "最寄り駅",
                value: "〇〇線「△△駅」北口 徒歩5分",
                color: "#0d9488",
                bg: "rgba(13,148,136,0.08)",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                ),
                label: "電話番号",
                value: "03-XXXX-XXXX",
                color: "#10b981",
                bg: "rgba(16,185,129,0.08)",
              },
              {
                icon: (
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                    <polyline points="22,6 12,13 2,6"/>
                  </svg>
                ),
                label: "メール",
                value: "info@aozora-pharmacy.example",
                color: "#8b5cf6",
                bg: "rgba(139,92,246,0.08)",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex items-start gap-4 p-4 rounded-xl"
                style={{ background: item.bg, border: `1px solid ${item.color}20` }}
              >
                <div
                  className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0"
                  style={{ background: item.color, color: "white" }}
                >
                  {item.icon}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-400 mb-0.5">{item.label}</p>
                  <p
                    className="text-sm font-semibold whitespace-pre-line leading-relaxed"
                    style={{ color: "#0c4a6e" }}
                  >
                    {item.value}
                  </p>
                </div>
              </div>
            ))}

            {/* Parking note */}
            <div
              className="flex items-center gap-3 p-4 rounded-xl"
              style={{
                background: "rgba(14,165,233,0.05)",
                border: "1.5px dashed rgba(14,165,233,0.2)",
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#0ea5e9" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="1" y="3" width="15" height="13" rx="2"/>
                <path d="M16 8h4l3 3v5h-7V8z"/>
                <circle cx="5.5" cy="18.5" r="2.5"/>
                <circle cx="18.5" cy="18.5" r="2.5"/>
              </svg>
              <p className="text-xs text-slate-500 leading-relaxed">
                お車でお越しの方：近隣コインパーキングをご利用ください（当店駐車場なし）
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
