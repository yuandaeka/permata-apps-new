"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCulture } from "@/context/CultureContext";
import { HopeTree } from "@/components/HopeTree";
import {
  Users,
  ShieldCheck,
  Activity,
  Trophy,
  Gamepad2,
  MessageCircle,
  Camera,
} from "lucide-react";
import Link from "next/link";

const Dashboard = () => {
  const { culture } = useCulture();

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="max-w-7xl mx-auto px-6 md:px-8 py-10 md:py-16"
    >
      {/* ================= TOP SECTION ================= */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          {/* Banner Header */}
          <header className="bg-tint border border-brand-200 rounded-xl p-8 md:p-10 relative overflow-hidden">
            <h2 className="text-2xl md:text-3xl font-semibold text-fg">
              Halo, Penyintas Tangguh!
            </h2>
            <p className="mt-2 text-base text-fg-muted">
              {culture === "aceh"
                ? '"Peugah hal nyang na, peubuet nyang baik" – Katakanlah yang ada, perbuatlah yang baik.'
                : '"Mambangkik Batang Tarandam" – Semangat bangkit dari keterpurukan.'}
            </p>
          </header>

          {/* Feature Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Forum — no link (not clickable in original) */}
            <div className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group">
              <Users size={24} className="text-fg-brand mb-4" />
              <h4 className="text-base font-semibold text-fg">
                {culture === "aceh" ? "Saweu Syedara" : "Badunsanak"}
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Forum Terkurasi &amp; Anonim
              </p>
            </div>

            {/* Tele Screening */}
            <Link
              href="/tele-screening"
              prefetch={false}
              className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group focus-visible:outline-2 focus-visible:outline-action"
            >
              <ShieldCheck size={24} className="text-fg-brand mb-4" />
              <h4 className="text-base font-semibold text-fg">
                Tele-Screening &amp; Triage
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Deteksi Risiko Berbasis AI
              </p>
            </Link>

            {/* AI Companion */}
            <Link
              href="/ai-companion"
              prefetch={false}
              className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group focus-visible:outline-2 focus-visible:outline-action"
            >
              <MessageCircle size={24} className="text-fg-brand mb-4" />
              <h4 className="text-base font-semibold text-fg">
                AI Mental Support Companion
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Hybrid AI + Crisis Detection
              </p>
            </Link>

            {/* Mood+Food Analyzer */}
            <Link
              href="/mood-food"
              prefetch={false}
              className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group focus-visible:outline-2 focus-visible:outline-action"
            >
              <Camera size={24} className="text-fg-brand mb-4" />
              <h4 className="text-base font-semibold text-fg">
                Mood + Food AI Analyzer
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Analisis Emosi &amp; Nutrisi Berbasis AI
              </p>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - HOPE TREE */}
        <div className="bg-surface border border-line rounded-xl p-8 shadow-xs flex flex-col items-center">
          <h3 className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase mb-8">
            Progress Resiliensi
          </h3>

          <HopeTree level={3} />

          <div className="mt-8 w-full">
            <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-brand-500 rounded-full"
                style={{ width: "60%" }}
              />
            </div>
            <div className="flex justify-between text-xs text-fg-subtle mt-2">
              <span>Resiliensi</span>
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DAILY GOALS ================= */}
      <div className="mt-14">
        <div className="flex items-center gap-2 mb-6">
          <Trophy size={20} className="text-fg-brand" />
          <h3 className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase">
            Target Harian
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Jurnal Hikmah", xp: "+50 XP Refleksi", href: "/jurnal" },
            { title: "Latihan Napas", xp: "+30 XP Tenang", href: "/game-breath" },
            { title: "Meditasi Budaya", xp: "+40 XP Fokus", href: "/game-healing" },
          ].map((goal) => (
            <div
              key={goal.title}
              className="bg-surface border border-line rounded-lg p-5 flex items-center gap-4 hover:border-line-strong hover:shadow-sm transition-all duration-200"
            >
              <Link href={goal.href} prefetch={false} className="flex-1">
                <h5 className="font-medium text-fg">{goal.title}</h5>
                <p className="text-xs text-fg-muted mt-0.5">{goal.xp}</p>
              </Link>
              <input
                type="checkbox"
                defaultChecked={false}
                className="w-5 h-5 ml-auto accent-action rounded"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= GAME CENTER ================= */}
      <div className="mt-14">
        <div className="flex items-center gap-2 mb-6">
          <Gamepad2 size={20} className="text-fg-brand" />
          <h3 className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase">
            Game Center Resiliensi
          </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
          <Link href="/game-quake" prefetch={false}>
            <div className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-base font-semibold text-fg mb-1">
                Sigap Bencana
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Edukasi Mitigasi &amp; Respons Cepat
              </p>
            </div>
          </Link>

          <Link href="/game-healing" prefetch={false}>
            <div className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-base font-semibold text-fg mb-1">
                Pinch and Drop
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Prepare before disaster
              </p>
            </div>
          </Link>

          <Link href="/game-adventure" prefetch={false}>
            <div className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-base font-semibold text-fg mb-1">
                Adventure Budaya
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Roleplay Naratif Nusantara
              </p>
            </div>
          </Link>

          {/* Roleplay — emphasis card */}
          <Link href="/roleplay" prefetch={false}>
            <div className="bg-emphasis text-white rounded-lg p-6 shadow-xs hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-base font-semibold text-white mb-1">
                Roleplay Psikoedukasi
              </h4>
              <p className="text-xs text-white/75 mt-1 leading-relaxed">
                Simulasi Mental &amp; Growth Path
              </p>
            </div>
          </Link>

          <Link href="/game-siagaminang" prefetch={false}>
            <div className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-base font-semibold text-fg mb-1">
                Siaga Minang
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Mempersiapkan tangkap sigap bencana dan melatih motorik
              </p>
            </div>
          </Link>

          <Link href="/game-breath" prefetch={false}>
            <div className="bg-surface border border-line rounded-lg p-6 shadow-xs hover:border-line-strong hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
              <h4 className="text-base font-semibold text-fg mb-1">
                Breathing Calm
              </h4>
              <p className="text-xs text-fg-muted mt-1 leading-relaxed">
                Latihan Nafas Anti Stress
              </p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;
