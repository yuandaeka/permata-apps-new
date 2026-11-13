"use client";

import React from "react";
import { motion } from "framer-motion";
import { useCulture } from "@/context/CultureContext";
import { ShieldCheck, BrainCircuit, Users } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const LandingPage = () => {
  const { theme } = useCulture();

  return (
    <div className="max-w-7xl mx-auto px-8 py-20">
      <div className="grid lg:grid-cols-2 gap-20 items-center">
        <motion.div
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="uppercase tracking-[0.4em] text-[10px] font-black opacity-40 mb-6 block">
            Integrasi Pendidikan Resiliensi Mental
          </span>
          <h1 className="text-7xl lg:text-8xl font-black leading-[0.85] tracking-tighter mb-10">
            Membangun <br /> Beton{" "}
            <span className={`${theme.accent} italic font-serif`}>
              Di Dalam Jiwa.
            </span>
          </h1>
          <p className="text-xl opacity-70 leading-relaxed mb-12 font-medium max-w-lg text-justify">
            PERMATA mendekonstruksi pendekatan klinis Barat menjadi metode
            humanis berbasis kearifan lokal untuk pertumbuhan mental
            pasca-trauma.
          </p>
          <Link
            href="/dashboard"
            prefetch={false}
            className={`inline-block px-12 py-6 rounded-3xl text-white font-black uppercase tracking-[0.2em] text-xs shadow-2xl hover:scale-105 transition-all cursor-pointer ${theme.btn}`}
          >
            Mulai Pemulihan
          </Link>
        </motion.div>

        <div className="bg-gray-400 aspect-[4/5] rounded-[5rem] overflow-hidden shadow-2xl border-[16px] border-white relative">
          <Image
            src="/permata.png"
            className="w-full h-full object-cover transition duration-700 hover:scale-105"
            alt="PERMATA Project Contextual"
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
        </div>
      </div>

      <div className="mt-40 grid md:grid-cols-3 gap-10 text-justify">
        <FeatureCard
          icon={<ShieldCheck size={40} />}
          title="Geo-Cultural Tagging"
          desc="Penyesuaian interface berdasarkan kearifan lokal Aceh dan Sumatera (Meunasah/Rumah Gadang)."
        />
        <Link href="/jurnal" prefetch={false} className="block group">
          <CardAI
            icon={<BrainCircuit size={40} />}
            title="AI Jurnal Hikmah"
            desc="Transformasi trauma menjadi makna melalui narasi reflektif berbasis AI sesuai siklus Trauma-Informed Care."
          />
        </Link>
        <FeatureCard
          icon={<Users size={40} />}
          title="Saweu Syedara"
          desc="Ruang dukungan sebaya anonim berbasis kearifan lokal (Badunsanak) untuk resiliensi kolektif."
        />
      </div>

      <footer className="mt-40 border-t border-black/5 py-20 opacity-80">
        <div className="grid md:grid-cols-4 gap-12 text-sm">
          <div className="col-span-2">
            <h4 className="text-3xl font-black tracking-tighter mb-4 italic">
              PERMATA.
            </h4>
            <p className="max-w-xs leading-relaxed font-medium opacity-60">
              Platform integrasi pendidikan resiliensi mental untuk pertumbuhan
              pasca-trauma berbasis kearifan lokal Nusantara.
            </p>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-[0.3em] mb-6 text-[10px]">
              Navigasi
            </h5>
            <ul className="space-y-4 font-bold uppercase text-[10px] tracking-widest">
              <li>
                <Link href="/" prefetch={false} className="hover:opacity-50 transition">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/dashboard" prefetch={false} className="hover:opacity-50 transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link href="/jurnal" prefetch={false} className="hover:opacity-50 transition">
                  Jurnal Hikmah
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h5 className="font-black uppercase tracking-[0.3em] mb-6 text-[10px]">
              Dukungan
            </h5>
            <ul className="space-y-4 font-bold uppercase text-[10px] tracking-widest opacity-60">
              <li>Pusat Bantuan</li>
              <li>Kebijakan Privasi</li>
              <li>2026 PERMATA Project</li>
            </ul>
          </div>
        </div>
        <div className="mt-20 pt-10 border-t border-black/5 flex justify-between items-center text-[10px] font-black uppercase tracking-[0.5em] opacity-20 italic">
          <span>Inovasi Resiliensi Mental</span>
          <span>Indonesia Tangguh</span>
        </div>
      </footer>
    </div>
  );
};

const FeatureCard = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-white/50 p-12 rounded-[4rem] border border-white shadow-sm hover:shadow-2xl transition-all group">
    <div className="mb-8 opacity-30 group-hover:opacity-100 transition-all">
      {icon}
    </div>
    <h3 className="text-2xl font-black mb-4 tracking-tighter">{title}</h3>
    <p className="text-sm opacity-60 leading-relaxed font-semibold">{desc}</p>
  </div>
);

const CardAI = ({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
}) => (
  <div className="bg-black text-white p-12 rounded-[4rem] shadow-2xl hover:scale-105 transition-all">
    <div className="mb-8 text-yellow-400">{icon}</div>
    <h3 className="text-2xl font-black mb-4 tracking-tighter">{title}</h3>
    <p className="text-sm opacity-60 leading-relaxed font-semibold">{desc}</p>
  </div>
);

export default LandingPage;
