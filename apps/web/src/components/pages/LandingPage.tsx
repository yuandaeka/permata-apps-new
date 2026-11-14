"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useCulture } from "@/context/CultureContext";

export default function LandingPage() {
  const { culture, setCulture } = useCulture();

  // Hope Tree XP Simulator state matching desain.html
  const [cause, setCause] = useState<number>(50);
  const [frequency, setFrequency] = useState<number>(5);
  const [duration, setDuration] = useState<number>(12);

  // Newsletter subscription state
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [emailInput, setEmailInput] = useState("");

  // Testimonial active index
  const [storyIndex, setStoryIndex] = useState(0);

  // Calculate dynamic XP progression
  const totalXP = cause * Math.min(14, Math.max(1, frequency)) * duration;

  let levelText = "Level 2 • Tunas Muda";
  let icon = "🌱";
  let status = "Mulai Menstabilkan Emosi";
  let readinessScore = "74 / 100 (Cukup Siap)";
  let barWidth = "45%";
  let progressText = "Progres XP: 45%";

  if (totalXP >= 3000) {
    levelText = "Level 5 • Rimba Resiliensi Mandiri";
    icon = "🌳";
    status = "Sangat Tangguh & Agen PFA Cilik";
    readinessScore = "98 / 100 (Paling Sigap)";
    barWidth = "100%";
    progressText = "Level Maksimal Tercapai!";
  } else if (totalXP >= 2000) {
    levelText = "Level 4 • Pohon Rindang Bertunas";
    icon = "🌲";
    status = "Adaptif & Resiliensi Tinggi";
    readinessScore = "92 / 100 (Sangat Sigap)";
    barWidth = "85%";
    progressText = "Progres XP: 85%";
  } else if (totalXP >= 1000) {
    levelText = "Level 3 • Tunas Mekar";
    icon = "🌿";
    status = "Bertumbuh Positif Pascabencana";
    readinessScore = "84 / 100 (Sigap)";
    barWidth = "65%";
    progressText = "Progres XP: 65%";
  }

  const stories = [
    {
      quote:
        '"Anak-anak di tenda darurat menyambut latihan pernapasan dan AI Jurnal Hikmah dengan ceria. Konsep Meuseuraya membuat mereka saling menguatkan alih-alih larut dalam kesedihan."',
      initials: "RA",
      avatarBg: "bg-brand-100 text-brand-800",
      name: "Rahmatiah, S.Psi.",
      role: "Relawan PFA & Psikososial Posko Pidie Aceh",
    },
    {
      quote:
        '"Filosofi Mambangkik Batang Tarandam menumbuhkan harga diri anak-anak sekolah dasar pasca gempa Pasaman. Mereka belajar bahwa musibah adalah awal kebangkitan karakter."',
      initials: "BS",
      avatarBg: "bg-accent-maroonLight text-accent-maroon",
      name: "Bundo Salma",
      role: "Guru Pendamping SD Pasaman Barat, Sumbar",
    },
    {
      quote:
        '"Integrasi DASS-21 dan Crisis Interception 119 sangat presisi. Kami bisa segera mendeteksi tanda bahaya depresi berat sebelum terlambat dan memberi rujukan yang tepat."',
      initials: "FW",
      avatarBg: "bg-emerald-100 text-emerald-800",
      name: "dr. Fadli Wijaya",
      role: "Koordinator Medis SafeConnect Hotline 119",
    },
  ];

  const handlePrevStory = () => {
    setStoryIndex((prev) => (prev === 0 ? stories.length - 1 : prev - 1));
  };

  const handleNextStory = () => {
    setStoryIndex((prev) => (prev === stories.length - 1 ? 0 : prev + 1));
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailInput.trim()) {
      setEmailSubscribed(true);
    }
  };

  return (
    <div className="w-full bg-[#F8FAF8] text-slate-800 selection:bg-brand-500 selection:text-white">
      {/* BEGIN: MainHeader */}
      <header className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/70 transition-all shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-20 flex items-center justify-between gap-4 relative">
          <Link className="flex items-center gap-3 group shrink-0" href="#home">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-brand-600 via-brand-700 to-emerald-800 flex items-center justify-center text-white shadow-md shadow-brand-900/10 group-hover:scale-105 transition-transform">
              <span className="text-lg">💎</span>
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-lg sm:text-xl font-extrabold tracking-tight text-slate-900">
                  PERMATA
                </span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-50 border border-brand-200 text-brand-800 tracking-wide uppercase">
                  Nusantara
                </span>
              </div>
              <span className="text-[10px] font-medium text-slate-400 tracking-wide">
                Resiliensi Jiwa &amp; PFA Anak
              </span>
            </div>
          </Link>

          <nav className="hidden lg:flex items-center gap-5 text-sm font-medium text-slate-600 shrink-0">
            <a
              className="transition hover:text-brand-700 font-medium py-1"
              href="#programs"
            >
              Modul Resiliensi
            </a>
            <a
              className="transition hover:text-brand-700 font-medium py-1"
              href="#calculator"
            >
              Pohon Harapan
            </a>
            <a
              className="transition hover:text-brand-700 font-medium py-1"
              href="#game-showcase"
            >
              Game Mitigasi
            </a>
          </nav>

          <div className="flex items-center gap-3 shrink-0">
            {/* Geo-Culture Switcher */}
            <div
              className="flex items-center bg-slate-100 p-1 rounded-full text-xs font-semibold"
              role="group"
              aria-label="Pilihan Kearifan Budaya"
            >
              <button
                id="btn-culture-aceh"
                type="button"
                onClick={() => setCulture("aceh")}
                className={
                  culture === "aceh"
                    ? "geo-pill-active px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5"
                    : "text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5"
                }
              >
                <span>🌿</span>
                <span>Aceh</span>
              </button>
              <button
                id="btn-culture-sumbar"
                type="button"
                onClick={() => setCulture("sumbar")}
                className={
                  culture === "sumbar"
                    ? "geo-pill-active px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5"
                    : "text-slate-600 hover:text-slate-900 px-3 py-1.5 rounded-full transition-all duration-300 flex items-center gap-1.5"
                }
              >
                <span>🏛️</span>
                <span>Sumbar</span>
              </button>
            </div>

            <Link
              className="bg-brand-900 hover:bg-brand-950 text-white text-xs sm:text-sm font-semibold px-5 py-2.5 rounded-full transition-all duration-200 shadow-md shadow-brand-900/10 hover:shadow-lg flex items-center gap-2 hover:-translate-y-0.5 shrink-0"
              href="/dashboard"
            >
              <span>Akses Dashboard</span>
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  d="M14 5l7 7m0 0l-7 7m7-7H3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                />
              </svg>
            </Link>
          </div>
        </div>
      </header>
      {/* END: MainHeader */}

      {/* BEGIN: HeroSection with Rich Mockup & Floating Badges */}
      <section
        className="relative pt-10 pb-20 lg:pt-16 lg:pb-28 overflow-hidden hero-glow-finora"
        id="home"
      >
        {/* Soft background ambient rings */}
        <div className="absolute top-20 right-10 w-96 h-96 bg-brand-200/30 rounded-full blur-3xl pointer-events-none -z-10" />
        <div className="absolute bottom-10 left-5 w-80 h-80 bg-emerald-100/40 rounded-full blur-2xl pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
            {/* Left Column: Copy, Tagline, CTAs & Micro-Stats */}
            <div className="lg:col-span-6 space-y-6">
              {/* Floating Pill Indicator */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-800 text-xs font-semibold shadow-xs">
                <span className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
                <span id="active-culture-tag">
                  {culture === "sumbar"
                    ? "Ekosistem Mambangkik Batang Tarandam (Minang) & PFA"
                    : "Ekosistem Kearifan Meuseuraya (Aceh) & PFA Siaga"}
                </span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] text-balance">
                Pulihkan Senyum &amp;{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-700 via-brand-600 to-emerald-500">
                  Resiliensi Jiwa
                </span>{" "}
                Anak Pascabencana
              </h1>

              <p className="text-base sm:text-lg text-slate-600 max-w-xl leading-relaxed">
                Mendampingi kesiapsiagaan darurat, Psychological First Aid (PFA),
                dan pertumbuhan pascatrauma (
                <em>Post-Traumatic Growth</em>) melalui kearifan lokal Aceh dan
                Minangkabau yang berakar kasih.
              </p>

              {/* CTA Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-1">
                <a
                  className="inline-flex items-center gap-2.5 bg-brand-900 hover:bg-brand-950 text-white font-semibold text-sm sm:text-base px-7 py-3.5 rounded-full transition-all shadow-lg shadow-brand-900/15 hover:shadow-xl hover:-translate-y-0.5"
                  href="#programs"
                >
                  <span>Mulai Pemulihan</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </a>
                <a
                  className="inline-flex items-center gap-2.5 bg-white border border-slate-200 text-slate-700 hover:text-brand-800 hover:border-brand-300 font-semibold px-5 py-3.5 rounded-full transition shadow-xs hover:shadow-sm"
                  href="#calculator"
                >
                  <span className="w-7 h-7 rounded-full bg-brand-100 flex items-center justify-center text-brand-700">
                    <svg className="w-3.5 h-3.5 fill-current ml-0.5" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </span>
                  <span>Simulasi Hope Tree</span>
                </a>
              </div>

              {/* 4 Micro-Badges Stats */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-6 border-t border-slate-200/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-brand-900 font-extrabold text-lg">
                    <svg
                      className="w-4 h-4 text-brand-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      />
                    </svg>
                    <span>100%</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Kearifan Nusantara
                  </p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-brand-900 font-extrabold text-lg">
                    <svg
                      className="w-4 h-4 text-amber-500 fill-amber-500"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    <span>DASS-21</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Skrining Terstandar
                  </p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-brand-900 font-extrabold text-lg">
                    <svg
                      className="w-4 h-4 text-emerald-600"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                      />
                    </svg>
                    <span>AI Guard</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Sensor PII &amp; Etis
                  </p>
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5 text-brand-900 font-extrabold text-lg">
                    <span className="text-brand-600 text-base">📶</span>
                    <span>Offline</span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium">
                    Ready di Pengungsian
                  </p>
                </div>
              </div>
            </div>

            {/* Right Column: Hero Visual Showcase with Layered Floating Cards */}
            <div className="lg:col-span-6 relative">
              <div className="absolute -inset-2 bg-gradient-to-r from-emerald-400/20 via-brand-500/20 to-teal-400/20 rounded-3xl blur-2xl opacity-70" />

              {/* Main Device-like Presentation Frame */}
              <div className="relative bg-white rounded-3xl p-3.5 sm:p-5 shadow-2xl border border-slate-100 card-shadow-finora">
                {/* Image Container with Aspect Ratio and Overlay Tag */}
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] sm:aspect-[16/10.5] shadow-sm bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    alt="Anak-anak nusantara saling merangkul ceria di zona rekonstruksi desa pascabencana dengan harapan masa depan"
                    className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-700"
                    src="https://lh3.googleusercontent.com/aida-public/AB6AXuBeHqdjgUm_X1IBuGw8ff1aXCEiP1qY0E-9bDkbZSDnoxBwaxpUbGZ64UCGIu1B6ZfwaPZfTz5LmApL70_xnHaRN9Q0wQM1LoPdls5kM0ZxVHMbJrGBwbaGWHS7xmLh5pvBgDf66d3Oh-oQW6rN81-tUOCrt9GxUVU109Xm98bmAlGpx60VjCs-4Dd1Xa_qPEC8hGPedwRQdWNutihVupHb08G3jZXO7SzalIOhugkcDqfOzPP73t2w"
                    onError={(e) => {
                      (e.currentTarget as HTMLImageElement).src = "/permata.png";
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent pointer-events-none" />

                  {/* Bottom Overlay Caption inside Hero Image */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="inline-flex items-center gap-1.5 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full text-xs font-semibold mb-1.5 border border-white/20">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <span>Program Pendampingan Psikososial Terpadu</span>
                    </div>
                    <p className="text-xs sm:text-sm font-medium text-slate-100 leading-snug line-clamp-2">
                      Menemani 1.240+ anak tangguh berdaya pulih dari trauma
                      gempa bumi, banjir bandang, dan erupsi.
                    </p>
                  </div>
                </div>

                {/* FLOATING BADGE 1: SafeConnect PFA 119 Hotline (Top-Right Floating) */}
                <div className="absolute -top-4 -right-3 sm:-right-4 glass-card py-2.5 px-4 rounded-2xl shadow-xl border border-emerald-100/80 flex items-center gap-3 animate-bounce-subtle">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center font-bold text-sm">
                    🛡️
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      <span className="text-xs font-extrabold text-slate-900">
                        SafeConnect PFA
                      </span>
                    </div>
                    <p className="text-[10px] text-slate-500 font-semibold">
                      Siaga Hotline 119 Intercept
                    </p>
                  </div>
                </div>

                {/* FLOATING BADGE 2: Hope Tree XP (Bottom-Left Floating Widget) */}
                <div className="absolute -bottom-6 -left-3 sm:-left-6 glass-card p-4 rounded-2xl shadow-2xl border border-emerald-100/90 max-w-[270px] w-full">
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-brand-600 to-emerald-400 text-white flex items-center justify-center font-bold text-lg shadow-md shadow-brand-600/30">
                      🌱
                    </div>
                    <div>
                      <div className="text-[10px] font-bold text-brand-700 uppercase tracking-wider">
                        Hope Tree Progress
                      </div>
                      <div className="text-sm font-extrabold text-slate-900 leading-tight">
                        Level 3 • Tunas Mekar
                      </div>
                    </div>
                  </div>
                  <div className="mt-3 w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-brand-600 to-emerald-400 h-full rounded-full transition-all duration-1000"
                      style={{ width: "82%" }}
                    />
                  </div>
                  <div className="mt-1.5 flex justify-between items-center text-[11px] text-slate-500">
                    <span className="font-medium">820 / 1.000 XP</span>
                    <span className="font-bold text-brand-700 bg-brand-50 px-2 py-0.5 rounded-full">
                      82% Progres
                    </span>
                  </div>
                </div>

                {/* FLOATING BADGE 3: Active Cultural Indicator (Top-Left Floating) */}
                <div className="absolute -top-3 -left-3 hidden sm:flex items-center gap-2 glass-card px-3.5 py-1.5 rounded-full shadow-lg border border-amber-100 text-xs font-semibold text-slate-800">
                  <span className="text-amber-500">🏛️</span>
                  <span id="badge-active-filosofi">
                    {culture === "sumbar"
                      ? "Mambangkik Batang Tarandam • Bangkit Tangguh"
                      : "Meuseuraya • Gotong Royong"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: HeroSection */}

      {/* BEGIN: 4 Core Modules */}
      <section className="py-20 bg-white border-y border-slate-100" id="programs">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center max-w-2xl mx-auto mb-14">
            <span className="text-xs font-extrabold text-brand-700 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3.5 py-1.5 rounded-full inline-block">
              4 Pilar &amp; Modul Utama PERMATA
            </span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3.5 tracking-tight">
              Ekosistem Pendampingan Resiliensi Berkelanjutan
            </h2>
            <p className="text-slate-600 mt-2.5 text-sm sm:text-base leading-relaxed">
              Integrasi psikologis klinis, gamifikasi kesiapsiagaan bencana, serta
              penguatan filosofi lokal yang ramah anak.
            </p>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* CARD 1: AI Jurnal Hikmah */}
            <div
              className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow-finora card-shadow-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              data-purpose="program-card"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-brand-50 rounded-bl-full -z-0 opacity-70 transition-transform group-hover:scale-125" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 p-3 rounded-2xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center shadow-xs group-hover:bg-brand-600 group-hover:text-white transition-all">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-100">
                    5-Mood Scale
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  AI Jurnal Hikmah
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Ruang aman refleksi emosi harian, deteksi suasana hati, dan
                  analisis makna pascatrauma berbasis kearifan Meuseuraya &amp;
                  Mambangkik Batang Tarandam.
                </p>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <span>🌈</span>
                    <span>Mood: Cemas ➔ Tenang Berdaya</span>
                  </div>
                  <div className="text-slate-500 font-medium text-[10px]">
                    Gamifikasi: +50 XP per sesi jurnal
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  className="text-xs font-bold text-brand-700 group-hover:text-brand-900 transition flex items-center gap-1"
                  href="/jurnal"
                >
                  <span>Buka Fitur</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  href="/jurnal"
                  className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* CARD 2: Tele-Screening (DASS-21) */}
            <div
              className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow-finora card-shadow-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              data-purpose="program-card"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0 opacity-70 transition-transform group-hover:scale-125" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 p-3 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center shadow-xs group-hover:bg-brand-600 group-hover:text-white transition-all">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                    Klinis Baku
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Tele-Screening &amp; Triage
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Skrining 21 instrumen terstandar untuk deteksi dini depresi,
                  kecemasan, dan stres anak dengan visualisasi triase berkode
                  warna &amp; rekomendasi rujukan.
                </p>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Triase: Ringan • Sedang • Eskalasi</span>
                  </div>
                  <div className="text-slate-500 font-medium text-[10px]">
                    Dilengkapi Panduan Konseling PFA
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  className="text-xs font-bold text-brand-700 group-hover:text-brand-900 transition flex items-center gap-1"
                  href="/tele-screening"
                >
                  <span>Buka Fitur</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  href="/tele-screening"
                  className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* CARD 3: AI Mental Support */}
            <div
              className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow-finora card-shadow-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              data-purpose="program-card"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-teal-50 rounded-bl-full -z-0 opacity-70 transition-transform group-hover:scale-125" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 p-3 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center shadow-xs group-hover:bg-brand-600 group-hover:text-white transition-all">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full border border-teal-100">
                    Gemini PFA
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  AI Mental Support
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Pendamping psikologis berbasis Gemini dengan Crisis
                  Interception darurat Hotline 119 dan sensor PII otomatis demi
                  keamanan data anak.
                </p>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <span>🛡️</span>
                    <span>Pre-LLM Guardrail &amp; Hotline 119</span>
                  </div>
                  <div className="text-slate-500 font-medium text-[10px]">
                    Respon Empatik Tanpa Diagnosa Keras
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                <Link
                  className="text-xs font-bold text-brand-700 group-hover:text-brand-900 transition flex items-center gap-1"
                  href="/ai-companion"
                >
                  <span>Buka Fitur</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </Link>
                <Link
                  href="/ai-companion"
                  className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </Link>
              </div>
            </div>

            {/* CARD 4: Game Center Resiliensi */}
            <div
              className="bg-white rounded-3xl p-6 border border-slate-200/80 card-shadow-finora card-shadow-hover transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
              data-purpose="program-card"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-bl-full -z-0 opacity-70 transition-transform group-hover:scale-125" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-5">
                  <div className="w-13 h-13 p-3 rounded-2xl bg-amber-50 border border-amber-100 text-amber-700 flex items-center justify-center shadow-xs group-hover:bg-brand-600 group-hover:text-white transition-all">
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                      <path
                        d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                  <span className="text-[11px] font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-100">
                    6 Modul Game
                  </span>
                </div>
                <h3 className="text-xl font-bold text-slate-900 mb-2">
                  Game Center Resiliensi
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
                  Simulasi mitigasi gempa &amp; tsunami (Phaser 3 Sigap Bencana,
                  Drag &amp; Drop Tas Siaga, Breathing Calm, dan Siaga Minang).
                </p>
                <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 mb-4 text-[11px] space-y-1">
                  <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                    <span>🎮</span>
                    <span>Phaser 3 + Latihan Napas Interaktif</span>
                  </div>
                  <div className="text-slate-500 font-medium text-[10px]">
                    Menumbuhkan Refleks Siaga Aman
                  </div>
                </div>
              </div>
              <div className="relative z-10 pt-4 border-t border-slate-100 flex items-center justify-between">
                <a
                  className="text-xs font-bold text-brand-700 group-hover:text-brand-900 transition flex items-center gap-1"
                  href="#game-showcase"
                >
                  <span>Buka Fitur</span>
                  <span className="transition-transform group-hover:translate-x-1">
                    →
                  </span>
                </a>
                <a
                  href="#game-showcase"
                  className="w-8 h-8 rounded-full bg-brand-50 text-brand-700 group-hover:bg-brand-600 group-hover:text-white flex items-center justify-center transition-colors"
                >
                  <svg
                    className="w-3.5 h-3.5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: 4 Core Modules */}

      {/* BEGIN: HowItWorks (Alur Resiliensi Step Timeline) */}
      <section className="py-20 bg-[#FBFDFB]" id="how-it-works">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Column: Title & Intro */}
            <div className="lg:col-span-4 space-y-4">
              <span className="text-xs font-extrabold text-brand-700 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3 py-1 rounded-full inline-block">
                Alur Pendampingan
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Langkah Pemulihan &amp; Resiliensi Jiwa
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                Protokol komprehensif terpadu dari deteksi trauma awal,
                stabilisasi relaksasi emosi, hingga pembentukan karakter anak
                tangguh berakar budaya.
              </p>
              <div className="pt-2">
                <a
                  className="inline-flex items-center gap-2 bg-brand-900 hover:bg-brand-950 text-white text-sm font-semibold px-6 py-3 rounded-full transition shadow-md shadow-brand-900/10"
                  href="#calculator"
                >
                  <span>Coba Simulasi Resiliensi</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                    />
                  </svg>
                </a>
              </div>
            </div>

            {/* Right Column: 3 Clean Timeline Steps */}
            <div className="lg:col-span-8">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
                {/* Step 1 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 card-shadow-finora relative flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 border border-brand-100 text-brand-700 flex items-center justify-center mb-5 font-extrabold text-lg">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="text-[11px] font-bold text-brand-700 uppercase tracking-wider mb-1">
                      Langkah 01
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base mb-2">
                      Deteksi &amp; Skrining Emosi
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Asesmen instrumen DASS-21 serta check-in ekspresi suasana
                      hati harian di AI Jurnal Hikmah secara ramah anak.
                    </p>
                  </div>
                  {/* Arrow connector for desktop */}
                  <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 items-center justify-center shadow-xs">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 card-shadow-finora relative flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 flex items-center justify-center mb-5 font-extrabold text-lg">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M14.828 14.828a4 4 0 01-5.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider mb-1">
                      Langkah 02
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base mb-2">
                      Stabilisasi &amp; Mitigasi Game
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Latihan pernapasan terpandu (Breathing Calm), simulasi
                      gempa Phaser 3, dan afirmasi welas asih tradisi lokal.
                    </p>
                  </div>
                  <div className="hidden md:flex absolute -right-3.5 top-1/2 -translate-y-1/2 z-10 w-7 h-7 rounded-full bg-white border border-slate-200 text-slate-400 items-center justify-center shadow-xs">
                    <svg
                      className="w-3.5 h-3.5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M9 5l7 7-7 7"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="bg-white p-6 rounded-3xl border border-slate-200/80 card-shadow-finora relative flex flex-col justify-between">
                  <div>
                    <div className="w-12 h-12 rounded-2xl bg-teal-50 border border-teal-100 text-teal-700 flex items-center justify-center mb-5 font-extrabold text-lg">
                      <svg
                        className="w-6 h-6"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="text-[11px] font-bold text-teal-700 uppercase tracking-wider mb-1">
                      Langkah 03
                    </div>
                    <h4 className="font-extrabold text-slate-900 text-base mb-2">
                      Care Circle &amp; Hope Tree
                    </h4>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      Pertumbuhan pohon harapan pascatrauma, dukungan berkala
                      orang tua/guru, serta proteksi darurat SafeConnect.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: HowItWorks */}

      {/* BEGIN: Interactive Hope Tree Simulator */}
      <section className="py-20 bg-white border-t border-slate-100" id="calculator">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-br from-[#F4F9F6] to-[#EAF5EE] rounded-3xl p-8 sm:p-12 border border-[#DBEBE1] relative overflow-hidden card-shadow-finora">
            {/* Subtle top decorative badge */}
            <div className="flex items-center justify-between mb-8">
              <span className="text-xs font-bold text-brand-800 uppercase tracking-wider bg-white/80 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-brand-200">
                🎮 Hope Tree Engine Simulator
              </span>
              <span className="hidden sm:inline-block text-xs font-bold text-emerald-700 bg-emerald-100/60 px-3 py-1 rounded-full">
                ✨ No Punitive Streak — Pemulihan Penuh Welas Asih
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              {/* Left: Form Inputs */}
              <div className="lg:col-span-6 space-y-6">
                <div>
                  <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                    Simulasi Pertumbuhan Resiliensi Jiwa
                  </h3>
                  <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                    Kalkulasikan akumulasi XP resiliensi anak berdasarkan
                    konsistensi aktivitas harian, latihan pernapasan, dan
                    refleksi hikmah bencana.
                  </p>
                </div>

                <form
                  className="space-y-4 pt-1"
                  onSubmit={(e) => e.preventDefault()}
                >
                  <div>
                    <label
                      className="block text-xs font-bold text-slate-700 mb-1.5"
                      htmlFor="cause-select"
                    >
                      Fokus Modul Harian
                    </label>
                    <select
                      className="w-full bg-white border border-slate-200 rounded-2xl text-sm py-3 px-4 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-medium text-slate-800 shadow-xs"
                      id="cause-select"
                      value={cause}
                      onChange={(e) => setCause(Number(e.target.value))}
                    >
                      <option value="50">
                        Jurnal Hikmah Harian (+50 XP / sesi)
                      </option>
                      <option value="30">
                        Latihan Napas Tenang 4-7-8 (+30 XP / sesi)
                      </option>
                      <option value="40">
                        Refleksi Budaya &amp; Cerita (+40 XP / sesi)
                      </option>
                      <option value="60">
                        Simulasi Game Tas Siaga Bencana (+60 XP / sesi)
                      </option>
                    </select>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                        htmlFor="frequency-input"
                      >
                        Frekuensi Mingguan (Sesi)
                      </label>
                      <div className="relative">
                        <input
                          className="w-full bg-white border border-slate-200 rounded-2xl text-sm py-3 px-4 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-bold text-slate-800 shadow-xs"
                          id="frequency-input"
                          max="14"
                          min="1"
                          step="1"
                          type="number"
                          value={frequency}
                          onChange={(e) => setFrequency(Number(e.target.value))}
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-semibold">
                          sesi/mgg
                        </span>
                      </div>
                    </div>

                    <div>
                      <label
                        className="block text-xs font-bold text-slate-700 mb-1.5"
                        htmlFor="duration-select"
                      >
                        Durasi Program Resiliensi
                      </label>
                      <select
                        className="w-full bg-white border border-slate-200 rounded-2xl text-sm py-3 px-4 focus:ring-2 focus:ring-brand-500 focus:border-brand-500 font-semibold text-slate-800 shadow-xs"
                        id="duration-select"
                        value={duration}
                        onChange={(e) => setDuration(Number(e.target.value))}
                      >
                        <option value="4">4 Minggu (1 Bulan Awal)</option>
                        <option value="12">12 Minggu (Fase 3 Bulan)</option>
                        <option value="24">24 Minggu (Fase Pemulihan 6 Bulan)</option>
                      </select>
                    </div>
                  </div>

                  <button
                    className="w-full bg-brand-900 hover:bg-brand-950 text-white font-bold text-sm py-3.5 rounded-2xl transition shadow-md shadow-brand-900/15 hover:shadow-lg flex items-center justify-center gap-2"
                    id="btn-calc"
                    type="button"
                  >
                    <span>Hitung Estimasi Pertumbuhan XP</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M14 5l7 7m0 0l-7 7m7-7H3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                      />
                    </svg>
                  </button>
                </form>
              </div>

              {/* Right: Dynamic Results Card */}
              <div className="lg:col-span-6">
                <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 card-shadow-finora relative">
                  <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                        Estimasi Akumulasi Resiliensi
                      </span>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span
                          className="text-4xl sm:text-5xl font-extrabold text-brand-900"
                          id="xp-result"
                        >
                          {totalXP.toLocaleString("id-ID")} XP
                        </span>
                        <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                          +Post-Traumatic Growth
                        </span>
                      </div>
                    </div>
                    {/* Animated Visual Tree Icon */}
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-brand-100 to-emerald-100 border border-brand-200/80 flex items-center justify-center text-3xl shadow-inner">
                      <span
                        className="transition-transform duration-500 hover:scale-125 select-none"
                        id="tree-icon"
                      >
                        {icon}
                      </span>
                    </div>
                  </div>

                  {/* Dynamic Stats Matrix */}
                  <div className="mt-6 space-y-3.5 text-xs sm:text-sm">
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">
                        Status Tingkat Resiliensi
                      </span>
                      <span
                        className="font-extrabold text-brand-900 bg-brand-50 px-3 py-1 rounded-full border border-brand-100"
                        id="stat-tree-level"
                      >
                        {levelText}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">
                        Indeks Ketahanan Psikologis
                      </span>
                      <span
                        className="font-bold text-slate-900"
                        id="stat-mental-health"
                      >
                        {status}
                      </span>
                    </div>
                    <div className="flex justify-between items-center py-1">
                      <span className="text-slate-500 font-medium">
                        Kesiapsiagaan Tanggap Bencana
                      </span>
                      <span
                        className="font-bold text-emerald-700"
                        id="stat-readiness"
                      >
                        {readinessScore}
                      </span>
                    </div>
                  </div>

                  {/* Finora Style Mini Progress Line */}
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <div className="flex justify-between text-[11px] text-slate-500 font-semibold mb-1.5">
                      <span>Evolusi Pohon Harapan</span>
                      <span className="text-brand-700" id="progress-percent">
                        {progressText}
                      </span>
                    </div>
                    <div className="w-full bg-slate-100 h-2.5 rounded-full overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-brand-600 to-emerald-400 h-full rounded-full transition-all duration-700"
                        id="xp-bar"
                        style={{ width: barWidth }}
                      />
                    </div>
                  </div>

                  <div className="mt-4 text-[11px] text-slate-400 italic">
                    *Didukung prinsip PFA: Tanpa sistem penalti (no-streak shame),
                    berorientasi pemulihan bertahap tanpa paksaan emosional.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Interactive Hope Tree Simulator */}

      {/* BEGIN: Game Center Showcase & Mood+Food AI Feature Highlight */}
      <section className="py-20 bg-[#FBFDFB]" id="game-showcase">
        <div className="max-w-7xl mx-auto px-6 space-y-16">
          {/* Subsection 1: Game Center Mitigasi Showcase */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-slate-200/80 card-shadow-finora">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-5 space-y-4">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 text-xs font-bold border border-amber-200">
                  <span>🎮</span>
                  <span>Simulasi Phaser 3 &amp; Web Audio</span>
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                  Game Center Resiliensi: Belajar Cerdas Hadapi Bencana
                </h3>
                <p className="text-sm text-slate-600 leading-relaxed">
                  Menghilangkan trauma gempa bumi dengan pendekatan{" "}
                  <em>serious gaming</em>. Anak dilatih mengenali jalur evakuasi,
                  menyusun tas siaga bencana (<em>Go-Bag</em>), dan menenangkan
                  denyut nadi secara interaktif.
                </p>
                <div className="space-y-2.5 pt-1 text-xs sm:text-sm font-semibold text-slate-700">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <span>
                      <strong>Sigap Bencana Phaser:</strong> Menghindar dari benda
                      runtuh &amp; menuju titik kumpul aman
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <span>
                      <strong>Pinch &amp; Drop Tas Siaga:</strong> Pilah obat,
                      senter, selimut &amp; dokumen penting
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs">
                      ✓
                    </span>
                    <span>
                      <strong>Breathing Calm Visualizer:</strong> Sinkronisasi visual
                      balon napas relaksasi
                    </span>
                  </div>
                </div>
              </div>

              {/* Visual Grid of Mini Game Cards */}
              <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Link
                  href="/game-healing"
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 hover:border-brand-300 transition block group"
                >
                  <div className="text-2xl mb-2">🎒</div>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-brand-800 transition mb-1">
                    Simulasi Tas Siaga Bencana
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Game drag-and-drop memilah kebutuhan krusial 72 jam pertama saat
                    evakuasi darurat.
                  </p>
                </Link>

                <Link
                  href="/game-siagaminang"
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 hover:border-brand-300 transition block group"
                >
                  <div className="text-2xl mb-2">🏃💨</div>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-brand-800 transition mb-1">
                    Evakuasi Cepat Minang
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Mengenali rambu sirine tsunami di pesisir Sumatera Barat dan titik
                    perbukitan aman.
                  </p>
                </Link>

                <Link
                  href="/game-breath"
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 hover:border-brand-300 transition block group"
                >
                  <div className="text-2xl mb-2">🎈</div>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-brand-800 transition mb-1">
                    Breathing Calm Relaksasi
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Latihan penurunan ritme panik anak dengan metafora mekar kembang
                    Jeumpa.
                  </p>
                </Link>

                <Link
                  href="/game-quake"
                  className="bg-slate-50 p-5 rounded-2xl border border-slate-200/70 hover:border-brand-300 transition block group"
                >
                  <div className="text-2xl mb-2">🤝</div>
                  <h5 className="text-sm font-bold text-slate-900 group-hover:text-brand-800 transition mb-1">
                    Meuseuraya Puzzle Siaga
                  </h5>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Kolaborasi membersihkan puing sekolah secara gotong royong
                    berhadiah Hope XP.
                  </p>
                </Link>
              </div>
            </div>
          </div>

          {/* Subsection 2: Mood + Food AI Analyzer */}
          <div
            className="bg-gradient-to-r from-emerald-900 via-brand-900 to-slate-900 rounded-3xl p-8 sm:p-12 text-white relative overflow-hidden card-shadow-finora"
            id="mood-food"
          >
            <div className="absolute right-0 top-0 w-80 h-80 bg-brand-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-7 space-y-4">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-semibold text-brand-300">
                  <span>🥗</span>
                  <span>Fitur Spesial Panduan Panduan GUIDE.md</span>
                </div>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
                  Mood + Food AI Analyzer: Nutrisi Pemulih Emosi Pengungsi
                </h3>
                <p className="text-sm text-brand-100/90 leading-relaxed">
                  Menghubungkan asupan gizi dapur umum darurat bencana dengan
                  kestabilan neurotransmitter stres anak (serotonin &amp;
                  kortisol). Memberikan panduan praktis bagi relawan dapur
                  logistik pengungsian.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs">
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                    <div className="font-bold text-emerald-300 text-sm mb-0.5">
                      Omega-3 &amp; Seng
                    </div>
                    <div className="text-brand-100/75">
                      Meredam kecemasan akut pascagempa
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                    <div className="font-bold text-amber-300 text-sm mb-0.5">
                      Karbohidrat Kompleks
                    </div>
                    <div className="text-brand-100/75">
                      Stabilitas energi &amp; mood anak di posko
                    </div>
                  </div>
                  <div className="bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/15">
                    <div className="font-bold text-teal-300 text-sm mb-0.5">
                      Rempah Hangat Lokal
                    </div>
                    <div className="text-brand-100/75">
                      Jahe &amp; kunyit penenang tidur alami
                    </div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 flex flex-col items-center justify-center">
                <div className="bg-white/10 backdrop-blur-md p-6 rounded-3xl border border-white/20 text-center max-w-sm w-full">
                  <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/15 flex items-center justify-center text-3xl">
                    🍲
                  </div>
                  <h4 className="font-bold text-base text-white">
                    Menu Rekomendasi Dapur Umum
                  </h4>
                  <p className="text-xs text-brand-200 mt-1 mb-4 leading-relaxed">
                    Analisis cerdas bahan makanan darurat yang tersedia untuk
                    kecukupan mikronutrien anak.
                  </p>
                  <Link
                    className="w-full bg-brand-400 hover:bg-brand-300 text-brand-950 font-extrabold text-xs py-2.5 px-4 rounded-full transition shadow-sm inline-block"
                    href="/mood-food"
                  >
                    Buka Katalog Mood + Food AI
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: Game Center Showcase & Mood+Food */}

      {/* BEGIN: Testimonials & Care Circle Voices */}
      <section className="py-20 bg-white" id="stories">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-extrabold text-brand-700 uppercase tracking-widest bg-brand-50 border border-brand-200/60 px-3.5 py-1.5 rounded-full inline-block">
                Suara Lapangan &amp; Care Circle
              </span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 mt-3.5 tracking-tight">
                Dampak Nyata Pendampingan PERMATA
              </h2>
              <p className="text-slate-600 mt-1.5 text-sm sm:text-base">
                Kesaksian relawan PFA, pendidik madrasah, dan koordinator
                pengungsian di garda terdepan bencana.
              </p>
            </div>

            {/* Arrow Controls */}
            <div className="flex items-center gap-2.5 mt-5 sm:mt-0">
              <button
                type="button"
                onClick={handlePrevStory}
                aria-label="Previous story"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition bg-white shadow-xs"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M15 19l-7-7 7-7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
              <button
                type="button"
                onClick={handleNextStory}
                aria-label="Next story"
                className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center text-slate-500 hover:text-slate-900 hover:border-slate-400 transition bg-white shadow-xs"
              >
                <svg
                  className="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    d="M9 5l7 7-7 7"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                  />
                </svg>
              </button>
            </div>
          </div>

          {/* 3 Testimonial Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map((story, idx) => {
              const isHighlighted = idx === storyIndex;
              return (
                <div
                  key={story.name}
                  className={`bg-[#FBFDFB] rounded-3xl p-7 border transition-all duration-300 card-shadow-finora flex flex-col justify-between ${
                    isHighlighted
                      ? "border-brand-500 ring-2 ring-brand-500/20"
                      : "border-slate-200/80"
                  }`}
                >
                  <div>
                    <div className="flex text-amber-400 mb-3 text-sm tracking-wide">
                      ★★★★★
                    </div>
                    <blockquote className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                      {story.quote}
                    </blockquote>
                  </div>
                  <div className="flex items-center gap-3.5 mt-6 pt-5 border-t border-slate-100">
                    <div
                      className={`w-11 h-11 rounded-2xl font-extrabold flex items-center justify-center text-sm shadow-xs ${story.avatarBg}`}
                    >
                      {story.initials}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-slate-900">
                        {story.name}
                      </div>
                      <div className="text-[11px] text-slate-500">
                        {story.role}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
      {/* END: Testimonials */}

      {/* BEGIN: CallToActionBanner */}
      <section className="py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="bg-gradient-to-r from-brand-950 via-brand-900 to-slate-950 rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden card-shadow-finora">
            <div className="absolute -right-16 -top-16 w-80 h-80 rounded-full bg-brand-500/15 pointer-events-none blur-2xl" />
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
              <div className="lg:col-span-8 space-y-3">
                <span className="text-xs font-bold tracking-widest text-brand-300 uppercase bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  Gerakan Resiliensi Mental Ramah Anak
                </span>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight leading-tight">
                  Wujudkan Generasi Anak Tangguh Bencana di Nusantara
                </h3>
                <p className="text-brand-100/80 text-sm sm:text-base max-w-xl leading-relaxed">
                  Bergabunglah bersama ribuan relawan PFA, posko darurat, dan
                  fasilitator sekolah dalam ekosistem terpadu PERMATA Nusantara.
                </p>
              </div>

              <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col items-start lg:items-end justify-center gap-4">
                <Link
                  className="bg-emerald-400 hover:bg-emerald-300 text-brand-950 font-extrabold text-sm sm:text-base px-8 py-4 rounded-full transition shadow-xl shadow-emerald-400/20 inline-flex items-center gap-2 hover:-translate-y-0.5"
                  href="/dashboard"
                >
                  <span>Akses Dashboard Sekarang</span>
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      d="M14 5l7 7m0 0l-7 7m7-7H3"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2.5"
                    />
                  </svg>
                </Link>
                <span className="text-xs text-brand-200/70 font-medium">
                  Gratis • Standar Klinis DASS-21 • Siaga 24 Jam
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* END: CallToActionBanner */}

      {/* BEGIN: MainFooter */}
      <footer className="bg-white border-t border-slate-100 pt-16 pb-12 text-slate-600 text-sm">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-10 pb-12 border-b border-slate-100">
            {/* Brand & Mission Info */}
            <div className="md:col-span-2 space-y-4">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-700 to-brand-900 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                  💎
                </div>
                <span className="text-xl font-extrabold text-slate-900">
                  PERMATA <span className="text-brand-700">Nusantara</span>
                </span>
              </div>
              <p className="text-xs text-slate-500 max-w-sm leading-relaxed">
                Platform Integrasi Pendidikan Resiliensi Mental &amp;
                Pendampingan Anak dalam Konteks Kebencanaan. Mengintegrasikan
                Psychological First Aid (PFA), pemantauan klinis baku DASS-21,
                serta kearifan budaya lokal Aceh (Meuseuraya) dan Minangkabau
                (Mambangkik Batang Tarandam).
              </p>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>Crisis Interception Hotline Siaga 119 Terhubung</span>
              </div>
            </div>

            {/* Modul Resiliensi */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Modul Resiliensi
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>
                  <Link className="hover:text-brand-700 transition" href="/jurnal">
                    AI Jurnal Hikmah
                  </Link>
                </li>
                <li>
                  <Link
                    className="hover:text-brand-700 transition"
                    href="/tele-screening"
                  >
                    Tele-Screening DASS-21
                  </Link>
                </li>
                <li>
                  <a
                    className="hover:text-brand-700 transition"
                    href="#game-showcase"
                  >
                    Game Center Mitigasi
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-brand-700 transition"
                    href="#calculator"
                  >
                    Hope Tree Engine
                  </a>
                </li>
                <li>
                  <Link
                    className="hover:text-brand-700 transition"
                    href="/mood-food"
                  >
                    Mood + Food Analyzer
                  </Link>
                </li>
              </ul>
            </div>

            {/* Layanan & Endpoint API */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Layanan &amp; Integrasi
              </h5>
              <ul className="space-y-2.5 text-xs text-slate-500">
                <li>
                  <Link
                    className="hover:text-brand-700 transition"
                    href="/ai-companion"
                  >
                    Gemini PFA Companion
                  </Link>
                </li>
                <li>
                  <a
                    className="hover:text-brand-700 transition"
                    href="#stories"
                  >
                    SafeConnect Hotline 119
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-brand-700 transition"
                    href="#programs"
                  >
                    Swagger API Docs (v1.2)
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-brand-700 transition"
                    href="#privacy"
                  >
                    Protokol Sensor PII Anak
                  </a>
                </li>
                <li>
                  <a
                    className="hover:text-brand-700 transition"
                    href="#privacy"
                  >
                    Persetujuan Orang Tua (Consent)
                  </a>
                </li>
              </ul>
            </div>

            {/* Newsletter & Warta Siaga */}
            <div>
              <h5 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-4">
                Warta Resiliensi Bencana
              </h5>
              <p className="text-xs text-slate-500 mb-3 leading-relaxed">
                Dapatkan materi panduan PFA &amp; tips kesiapsiagaan sekolah
                berkala langsung ke email Anda.
              </p>
              {emailSubscribed ? (
                <div className="bg-brand-50 border border-brand-200 text-brand-800 text-xs p-3 rounded-xl font-medium">
                  ✓ Terima kasih! Anda telah terdaftar dalam warta relawan resiliensi PERMATA.
                </div>
              ) : (
                <form className="space-y-2" onSubmit={handleNewsletterSubmit}>
                  <input
                    className="bg-slate-50 border border-slate-200 text-xs px-3.5 py-2.5 rounded-xl w-full focus:ring-2 focus:ring-brand-500 focus:border-brand-500 text-slate-800"
                    placeholder="Alamat email posko/pribadi"
                    required
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                  />
                  <button
                    type="submit"
                    className="w-full bg-brand-900 text-white text-xs py-2.5 rounded-xl font-bold hover:bg-brand-950 transition shadow-xs"
                  >
                    Daftar Buletin Relawan
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Bottom Legal Bar */}
          <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-4">
            <p>
              © 2025 PERMATA Nusantara Foundation. Seluruh hak cipta dilindungi
              undang-undang.
            </p>
            <div className="flex items-center gap-5">
              <a className="hover:text-slate-600 transition" href="#privacy">
                Perlindungan Data PII Anak
              </a>
              <a className="hover:text-slate-600 transition" href="#terms">
                Ketentuan Layanan PFA
              </a>
              <a className="hover:text-slate-600 transition" href="#security">
                Protokol Rujukan Darurat 119
              </a>
            </div>
          </div>
        </div>
      </footer>
      {/* END: MainFooter */}
    </div>
  );
}
