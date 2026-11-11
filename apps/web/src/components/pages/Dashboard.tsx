"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCulture } from "@/context/CultureContext";
import { HopeTree } from "@permata/ui";
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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-7xl mx-auto p-6 lg:p-12"
    >
      {/* ================= TOP SECTION ================= */}
      <div className="grid lg:grid-cols-3 gap-8">
        {/* LEFT SIDE */}
        <div className="lg:col-span-2 space-y-8">
          <header className="bg-white/40 p-12 rounded-[4rem] border border-white shadow-sm relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Activity size={120} />
            </div>

            <h2 className="text-4xl font-black">Halo, Penyintas Tangguh!</h2>

            <p className="mt-2 text-lg opacity-60 font-medium italic">
              &quot;Mambangkik Batang Tarandam&quot; - Semangat bangkit dari
              keterpurukan.
            </p>
          </header>

          {/* FEATURE CARDS */}
          <div className="grid md:grid-cols-3 gap-6">
            {/* Forum */}
            <div className="p-8 bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-black/5 group">
              <Users
                size={40}
                className="mb-4 opacity-30 group-hover:text-blue-500 transition-colors"
              />
              <h4 className="text-xl font-black">
                {culture === "Aceh" ? "Saweu Syedara" : "Badunsanak"}
              </h4>
              <p className="text-xs mt-2 opacity-50 font-bold uppercase tracking-wider italic">
                Forum Terkurasi &amp; Anonim
              </p>
            </div>

            {/* Tele Screening */}
            <Link href="/tele-screening">
              <div className="p-8 bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-black/5 group cursor-pointer">
                <ShieldCheck
                  size={40}
                  className="mb-4 opacity-30 group-hover:text-red-500 transition-colors"
                />
                <h4 className="text-xl font-black">
                  Tele-Screening &amp; Triage
                </h4>
                <p className="text-xs mt-2 opacity-50 font-bold uppercase tracking-wider italic">
                  Deteksi Risiko Berbasis AI
                </p>
              </div>
            </Link>

            {/* AI Companion */}
            <Link href="/ai-companion">
              <div className="p-8 bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-black/5 group cursor-pointer">
                <MessageCircle
                  size={40}
                  className="mb-4 opacity-30 group-hover:text-purple-500 transition-colors"
                />
                <h4 className="text-xl font-black">
                  AI Mental Support Companion (ChatBot)
                </h4>
                <p className="text-xs mt-2 opacity-50 font-bold uppercase tracking-wider italic">
                  Hybrid AI + Crisis Detection
                </p>
              </div>
            </Link>

            {/* MoodFoodAnalyzer */}
            <Link href="/mood-food">
              <div className="p-8 bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-black/5 group cursor-pointer">
                <Camera
                  size={40}
                  className="mb-4 opacity-30 group-hover:text-pink-500 transition-colors"
                />
                <h4 className="text-xl font-black">Mood + Food AI Analyzer</h4>
                <p className="text-xs mt-2 opacity-50 font-bold uppercase tracking-wider italic">
                  Analisis Emosi &amp; Nutrisi Berbasis AI
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* RIGHT SIDE - HOPE TREE */}
        <div className="bg-white/60 p-12 rounded-[4rem] border border-white shadow-2xl flex flex-col items-center justify-center">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] mb-12 opacity-40 italic">
            Progress Resiliensi
          </h3>

          <HopeTree level={3} />

          <div className="mt-12 w-full space-y-4">
            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-green-500 rounded-full"
                style={{ width: "60%" }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-black opacity-30 uppercase tracking-widest">
              <span>Resiliensi</span>
              <span>60%</span>
            </div>
          </div>
        </div>
      </div>

      {/* ================= DAILY GOALS ================= */}
      <div className="mt-16">
        <div className="flex items-center gap-3 mb-10">
          <Trophy size={22} className="text-yellow-500" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">
            Target Harian
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {[
            { title: "Jurnal Hikmah", xp: "+50 XP Refleksi" },
            { title: "Latihan Napas", xp: "+30 XP Tenang" },
            { title: "Meditasi Budaya", xp: "+40 XP Fokus" },
          ].map((goal) => (
            <div
              key={goal.title}
              className="bg-white/40 p-8 rounded-[3rem] border border-white flex items-center gap-6"
            >
              <div>
                <h5 className="font-black tracking-tighter text-lg">
                  {goal.title}
                </h5>
                <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest italic">
                  {goal.xp}
                </p>
              </div>
              <input
                type="checkbox"
                defaultChecked={false}
                className="ml-auto w-6 h-6 accent-green-600 cursor-pointer"
              />
            </div>
          ))}
        </div>
      </div>

      {/* ================= GAME CENTER ================= */}
      <div className="mt-24">
        <div className="flex items-center gap-3 mb-10">
          <Gamepad2 size={22} className="text-green-700" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">
            Game Center Resiliensi
          </h3>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          <Link href="/game-quake">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Sigap Bencana</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Edukasi Mitigasi &amp; Respons Cepat
              </p>
            </div>
          </Link>

          <Link href="/game-healing">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Pinch and Drop</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Prepare before disaster
              </p>
            </div>
          </Link>

          <Link href="/game-adventure">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Adventure Budaya</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Roleplay Naratif Nusantara
              </p>
            </div>
          </Link>

          <Link href="/roleplay">
            <div className="bg-black text-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Roleplay Psikoedukasi</h4>
              <p className="text-xs opacity-70 font-bold uppercase tracking-wider italic">
                Simulasi Mental &amp; Growth Path
              </p>
            </div>
          </Link>

          <Link href="/game-siagaminang">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Siaga Minang</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Mempersiapkan tangkap sigap bencana dan melatih motorik
              </p>
            </div>
          </Link>

          <Link href="/game-breath">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Breathing Calm</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
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
