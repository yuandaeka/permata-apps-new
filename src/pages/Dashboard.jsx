import React, { useContext } from "react";
import { motion } from "framer-motion";
import { CultureContext } from "../App";
import HopeTree from "../components/HopeTree";
import {
  Users,
  ShieldCheck,
  Activity,
  Trophy,
  Gamepad2,
  MessageCircle,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Camera } from "lucide-react";

const Dashboard = () => {
  const { culture } = useContext(CultureContext);

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

            <h2 className="text-4xl font-black">
              Halo, Penyintas Tangguh!
            </h2>

            <p className="mt-2 text-lg opacity-60 font-medium italic">
              "Mambangkik Batang Tarandam" - Semangat bangkit dari keterpurukan.
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
                Forum Terkurasi & Anonim
              </p>
            </div>

            {/* Tele Screening */}
            <Link to="/tele-screening">
              <div className="p-8 bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-black/5 group cursor-pointer">
                <ShieldCheck
                  size={40}
                  className="mb-4 opacity-30 group-hover:text-red-500 transition-colors"
                />
                <h4 className="text-xl font-black">
                  Tele-Screening & Triage
                </h4>
                <p className="text-xs mt-2 opacity-50 font-bold uppercase tracking-wider italic">
                  Deteksi Risiko Berbasis AI
                </p>
              </div>
            </Link>

            {/* AI Companion (NEW FEATURE) */}
            <Link to="/ai-companion">
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

            {/* MoodFoodAnalyzer (fitur scan makan)*/}
            <Link to="/mood-food">
              <div className="p-8 bg-white rounded-[3rem] shadow-sm hover:shadow-2xl transition-all border border-black/5 group cursor-pointer">
                <Camera
                  size={40}
                  className="mb-4 opacity-30 group-hover:text-pink-500 transition-colors"
                />
                <h4 className="text-xl font-black">
                  Mood + Food AI Analyzer
                </h4>
                <p className="text-xs mt-2 opacity-50 font-bold uppercase tracking-wider italic">
                  Analisis Emosi & Nutrisi Berbasis AI
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
              <div className="h-full bg-green-500 w-[65%] rounded-full transition-all duration-1000" />
            </div>

            <p className="text-[10px] text-center font-bold opacity-30 uppercase tracking-widest">
              Post-Traumatic Growth Index: 65%
            </p>
          </div>
        </div>
      </div>

      {/* ================= MISSION SECTION ================= */}
      <div className="mt-20">
        <div className="flex items-center gap-3 mb-8">
          <Trophy size={20} className="text-yellow-600" />
          <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic">
            Misi Pemulihan Harian (Gamification)
          </h3>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Quest 1 */}
          <div className="bg-white/40 p-8 rounded-[3rem] border border-white flex items-center gap-6 hover:bg-white transition-all shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-yellow-100 flex items-center justify-center text-yellow-600 font-black text-xl shadow-inner">
              01
            </div>
            <div>
              <h5 className="font-black tracking-tighter text-lg">
                Tulis 1 Hikmah
              </h5>
              <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest italic">
                +50 XP Resiliensi
              </p>
            </div>
            <input
              type="checkbox"
              className="ml-auto w-6 h-6 accent-green-600 cursor-pointer"
            />
          </div>

          {/* Quest 2 */}
          <div className="bg-white/40 p-8 rounded-[3rem] border border-white flex items-center gap-6 hover:bg-white transition-all shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 font-black text-xl shadow-inner">
              02
            </div>
            <div>
              <h5 className="font-black tracking-tighter text-lg">
                {culture === "Aceh" ? "Saweu Syedara" : "Badunsanak"}
              </h5>
              <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest italic">
                +30 XP Sosial
              </p>
            </div>
            <input
              type="checkbox"
              className="ml-auto w-6 h-6 accent-green-600 cursor-pointer"
            />
          </div>

          {/* Quest 3 */}
          <div className="bg-white/40 p-8 rounded-[3rem] border border-white flex items-center gap-6 hover:bg-white transition-all shadow-sm">
            <div className="w-16 h-16 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 font-black text-xl shadow-inner">
              03
            </div>
            <div>
              <h5 className="font-black tracking-tighter text-lg">
                Meditasi Budaya
              </h5>
              <p className="text-[10px] opacity-50 font-bold uppercase tracking-widest italic">
                +40 XP Fokus
              </p>
            </div>
            <input
              type="checkbox"
              className="ml-auto w-6 h-6 accent-green-600 cursor-pointer"
            />
          </div>
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
          <Link to="/game-quake">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Sigap Bencana</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Edukasi Mitigasi & Respons Cepat
              </p>
            </div>
          </Link>

          <Link to="/game-healing">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Pinch and Drop</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Prepare before disaster
              </p>
            </div>
          </Link>

          <Link to="/game-adventure">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Adventure Budaya</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Roleplay Naratif Nusantara
              </p>
            </div>
          </Link>

          <Link to="/roleplay">
            <div className="bg-black text-white p-10 rounded-[3rem] shadow-xl hover:shadow-2xl transition-all cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">
                🎭 Roleplay Psikoedukasi
              </h4>
              <p className="text-xs opacity-70 font-bold uppercase tracking-wider italic">
                Simulasi Mental & Growth Path
              </p>
            </div>
          </Link>

          <Link to="/game-memory">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Pulih Bersama</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                BUILDING & TRAUMA RECOVERY
              </p>
            </div>
          </Link>

          <Link to="/game-siagaminang">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Siaga Minang</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Mempersiapkan tangkap sigap bencana dan melatih motorik
              </p>
            </div>
          </Link>

          <Link to="/game-breath">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Breathing Calm</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Latihan Nafas Anti Stress
              </p>
            </div>
          </Link>

          <Link to="/game-story">
            <div className="bg-white p-10 rounded-[3rem] shadow-md hover:shadow-2xl transition-all border border-black/5 cursor-pointer hover:-translate-y-2 duration-300">
              <h4 className="text-xl font-black mb-3">Story of Strength</h4>
              <p className="text-xs opacity-50 font-bold uppercase tracking-wider italic">
                Cerita Ketangguhan Penyintas 
              </p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
};

export default Dashboard;