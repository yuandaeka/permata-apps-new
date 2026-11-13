"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Gamepad2, ArrowRight } from "lucide-react";

const GameHealing = () => {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-md w-full bg-white p-12 rounded-[4rem] shadow-2xl border border-black/5 text-center space-y-8"
      >
        {/* ICON */}
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-[2rem] flex items-center justify-center mx-auto shadow-inner">
          <Gamepad2 size={48} />
        </div>

        {/* TEXT */}
        <div className="space-y-2">
          <h1 className="text-3xl font-black tracking-tighter">
            Disaster Ready Game
          </h1>
          <p className="text-sm opacity-50 font-bold uppercase tracking-widest italic">
            Pick &amp; Drop Emergency Bag
          </p>
        </div>

        <p className="text-gray-600 font-medium">
          Pilih barang penting dan masukkan ke dalam tas darurat sebelum bencana
          datang!
        </p>

        {/* LINK KE GAME */}
        <a
          href="/PickAndDrop.html"
          className="flex items-center justify-center gap-3 w-full bg-black text-white py-6 rounded-[2rem] font-black text-xl hover:bg-green-600 transition-all group"
        >
          Mainkan Game
          <ArrowRight className="group-hover:translate-x-2 transition-transform" />
        </a>

        {/* BACK BUTTON */}
        <Link
          href="/dashboard"
          prefetch={false}
          className="inline-block text-xs font-black opacity-30 uppercase tracking-[0.2em] hover:opacity-100 transition-opacity"
        >
          Kembali ke Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default GameHealing;
