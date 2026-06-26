import React from "react";

const hours = [
  { day: "月曜日", time: "09:00 〜 19:00", open: true },
  { day: "火曜日", time: "09:00 〜 19:00", open: true },
  { day: "水曜日", time: "09:00 〜 19:00", open: true },
  { day: "木曜日", time: "09:00 〜 19:00", open: true },
  { day: "金曜日", time: "09:00 〜 19:00", open: true },
  { day: "土曜日", time: "09:00 〜 14:00", open: true },
  { day: "日曜日", time: "定休日", open: false },
  { day: "祝日", time: "定休日", open: false },
];

export default function HoursSection() {
  return (
    <section
      id="hours"
      className="py-24 relative overflow-hidden"
      style={{
        background: "linear-gradient(150deg, #f0f9ff 0%, #ecfdf5 100%)",
      }}
    >
      {/* Background decoration */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute rounded-full animate-pharmacy-float-a"
          style={{
            width: 300,
            height: 300,
            top: "-80px",
            right: "-60px",
            background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          }}
        />
      </div>

      <div className="max-w-5xl mx-auto px-6 relative">
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
            BUSINESS HOURS
          </div>
          <h2 className="text-3xl md:text-4xl font-black mb-4" style={{ color: "#0c4a6e" }}>
            営業時間
          </h2>
          <p className="text-slate-400 text-base max-w-sm mx-auto">
            お気軽にご来店・お電話ください
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 items-start">
          {/* Hours table */}
          <div
            className="rounded-2xl overflow-hidden"
            style={{
              background: "white",
              boxShadow: "0 8px 40px rgba(14,165,233,0.08)",
              border: "1.5px solid rgba(14,165,233,0.12)",
            }}
          >
            <div
              className="px-6 py-4 flex items-center gap-3"
              style={{ background: "linear-gradient(135deg, #0ea5e9, #0d9488)" }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"/>
                <polyline points="12 6 12 12 16 14"/>
              </svg>
              <span className="text-white font-bold text-sm">診療スケジュール</span>
            </div>

            <div className="divide-y" style={{ borderColor: "rgba(14,165,233,0.08)" }}>
              {hours.map((row) => (
                <div
                  key={row.day}
                  className="flex items-center justify-between px-6 py-3.5 transition-colors duration-150 hover:bg-sky-50"
                >
                  <span
                    className="text-sm font-bold w-20"
                    style={{ color: row.open ? "#0c4a6e" : "#94a3b8" }}
                  >
                    {row.day}
                  </span>
                  <div className="flex items-center gap-2">
                    {row.open ? (
                      <>
                        <span
                          className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: "rgba(16,185,129,0.12)", color: "#059669" }}
                        >
                          ● 営業
                        </span>
                        <span className="text-sm font-semibold" style={{ color: "#0c4a6e" }}>
                          {row.time}
                        </span>
                      </>
                    ) : (
                      <span
                        className="inline-flex items-center px-3 py-0.5 rounded-full text-xs font-bold"
                        style={{ background: "rgba(148,163,184,0.12)", color: "#94a3b8" }}
                      >
                        定休日
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Additional info */}
          <div className="flex flex-col gap-5">
            {/* Notice card */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "rgba(14,165,233,0.06)",
                border: "1.5px solid rgba(14,165,233,0.18)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #0ea5e9, #0d9488)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                </div>
                <span className="font-bold text-sm" style={{ color: "#0369a1" }}>
                  ご注意・お知らせ
                </span>
              </div>
              <ul className="text-sm text-slate-500 space-y-2 leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">・</span>
                  処方せんの受付は閉店30分前までとなります
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">・</span>
                  年末年始・お盆は営業時間が異なる場合があります
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-sky-400 mt-0.5">・</span>
                  詳細はお電話にてご確認ください
                </li>
              </ul>
            </div>

            {/* Phone card */}
            <div
              className="p-5 rounded-2xl"
              style={{
                background: "white",
                border: "1.5px solid rgba(16,185,129,0.2)",
                boxShadow: "0 4px 20px rgba(16,185,129,0.08)",
              }}
            >
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{ background: "linear-gradient(135deg, #10b981, #0d9488)" }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.18 2 2 0 0 1 3.6 1h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 8.96a16 16 0 0 0 6 6l.9-.9a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>
                  </svg>
                </div>
                <span className="font-bold text-sm" style={{ color: "#065f46" }}>お電話でのお問い合わせ</span>
              </div>
              <p
                className="text-2xl font-black tracking-wide mb-1"
                style={{ color: "#0d9488" }}
              >
                03-XXXX-XXXX
              </p>
              <p className="text-xs text-slate-400">
                営業時間内にお電話ください
              </p>
            </div>

            {/* Emergency */}
            <div
              className="p-4 rounded-2xl flex items-center gap-3"
              style={{
                background: "rgba(245,158,11,0.06)",
                border: "1.5px solid rgba(245,158,11,0.2)",
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                <line x1="12" y1="9" x2="12" y2="13"/>
                <line x1="12" y1="17" x2="12.01" y2="17"/>
              </svg>
              <p className="text-xs text-amber-700 leading-relaxed">
                夜間・緊急時は救急相談窓口（#7119）または119番へ
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
