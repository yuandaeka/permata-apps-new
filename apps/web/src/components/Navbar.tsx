"use client";

import Link from "next/link";
import { MapPin, LayoutDashboard, BookOpen, Home } from "lucide-react";
import { useCulture } from "@/context/CultureContext";

export default function Navbar() {
  const { culture, setCulture, theme } = useCulture();

  return (
    <nav className="sticky top-0 z-50 bg-white/30 backdrop-blur-md border-b border-black/5 px-8 py-5">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <Link
          href="/"
          prefetch={false}
          className="text-3xl font-black tracking-tighter uppercase italic flex items-center gap-2"
        >
          PERMATA <span className="w-2 h-2 rounded-full bg-green-500"></span>
        </Link>

        <div className="flex gap-4 md:gap-10 font-black uppercase text-[10px] tracking-[0.1em] md:tracking-[0.2em] items-center">
          <Link
            href="/"
            prefetch={false}
            className="hover:opacity-50 transition flex items-center gap-1.5 underline-offset-8 hover:underline"
          >
            <Home size={14} /> <span className="hidden sm:inline">Home</span>
          </Link>
          <Link
            href="/dashboard"
            prefetch={false}
            className="hover:opacity-50 transition flex items-center gap-1.5 underline-offset-8 hover:underline"
          >
            <LayoutDashboard size={14} /> Dashboard
          </Link>
          <Link
            href="/jurnal"
            prefetch={false}
            className="hover:opacity-50 transition flex items-center gap-1.5 underline-offset-8 hover:underline"
          >
            <BookOpen size={14} /> Jurnal
          </Link>
        </div>

        <button
          onClick={() => setCulture((c) => (c === "Aceh" ? "Sumbar" : "Aceh"))}
          className={`flex items-center gap-3 px-6 py-3 rounded-full shadow-2xl text-white text-[10px] font-black tracking-widest transition-all active:scale-95 ${theme.btn} hover:opacity-90`}
        >
          <MapPin size={14} /> LOKASI: {culture.toUpperCase()}
        </button>
      </div>
    </nav>
  );
}
