"use client";

import React, { useState, useEffect } from "react";

export default function PharmacyHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const navItems = [
    { label: "ホーム", id: "hero" },
    { label: "サービス", id: "services" },
    { label: "営業時間", id: "hours" },
    { label: "アクセス", id: "access" },
  ];

  return (
    <header
      className="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
      style={{
        background: scrolled ? "rgba(255,255,255,0.96)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        borderBottom: `1px solid ${scrolled ? "rgba(14,165,233,0.18)" : "rgba(14,165,233,0.08)"}`,
        boxShadow: scrolled ? "0 4px 24px rgba(14,165,233,0.06)" : "none",
      }}
    >
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="flex items-center gap-3 group"
        >
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #0d9488)" }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10z"/>
              <path d="M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"/>
            </svg>
          </div>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-black tracking-tight" style={{ color: "#0c4a6e" }}>
              あおぞら薬局
            </span>
            <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-400 uppercase">
              Aozora Pharmacy
            </span>
          </div>
        </button>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-sm font-semibold text-slate-500 hover:text-sky-500 transition-colors duration-200 relative group"
            >
              {item.label}
              <span
                className="absolute -bottom-1 left-0 w-0 h-0.5 rounded-full transition-all duration-200 group-hover:w-full"
                style={{ background: "linear-gradient(90deg, #0ea5e9, #0d9488)" }}
              />
            </button>
          ))}
        </nav>

        {/* CTA + Mobile toggle */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => scrollTo("hours")}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 rounded-full text-sm font-bold text-white transition-all duration-200 hover:scale-105 active:scale-95"
            style={{
              background: "linear-gradient(135deg, #0ea5e9, #0d9488)",
              boxShadow: "0 4px 20px rgba(14,165,233,0.3)",
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="16" y1="13" x2="8" y2="13"/>
              <line x1="16" y1="17" x2="8" y2="17"/>
            </svg>
            処方せん受付
          </button>

          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200"
            style={{
              background: menuOpen ? "rgba(14,165,233,0.15)" : "rgba(14,165,233,0.08)",
              color: "#0ea5e9",
            }}
            aria-label="メニュー"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              {menuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"/>
                  <line x1="6" y1="6" x2="18" y2="18"/>
                </>
              ) : (
                <>
                  <line x1="3" y1="8" x2="21" y2="8"/>
                  <line x1="3" y1="16" x2="21" y2="16"/>
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className="md:hidden overflow-hidden transition-all duration-300"
        style={{ maxHeight: menuOpen ? "300px" : "0px" }}
      >
        <div
          className="px-6 pb-5 flex flex-col gap-1"
          style={{ background: "rgba(255,255,255,0.98)", borderTop: "1px solid rgba(14,165,233,0.1)" }}
        >
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => scrollTo(item.id)}
              className="text-left py-3 px-4 rounded-xl text-sm font-semibold text-slate-600 hover:text-sky-500 hover:bg-sky-50 transition-all duration-150"
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={() => scrollTo("hours")}
            className="mt-2 py-3 px-4 rounded-full text-sm font-bold text-white text-center"
            style={{ background: "linear-gradient(135deg, #0ea5e9, #0d9488)" }}
          >
            処方せん受付
          </button>
        </div>
      </div>
    </header>
  );
}
