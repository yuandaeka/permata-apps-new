"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Package, ArrowRight } from "lucide-react";

const GameHealing = () => {
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.32 }}
        className="max-w-md w-full bg-surface border border-line rounded-xl p-8 shadow-lg text-center space-y-6"
      >
        {/* Icon tile */}
        <div className="w-16 h-16 bg-tint rounded-lg flex items-center justify-center mx-auto">
          <Package size={32} className="text-fg-brand" />
        </div>

        {/* Text */}
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-fg">Pick &amp; Drop</h1>
          <p className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase">
            Siapkan Tas Darurat
          </p>
        </div>

        <p className="text-sm text-fg-muted leading-relaxed">
          Pilih barang penting dan masukkan ke dalam tas darurat sebelum bencana datang!
        </p>

        {/* CTA */}
        <a
          href="/PickAndDrop.html"
          className="flex items-center justify-center gap-2 w-full h-12 rounded-md bg-action text-white font-medium hover:bg-action-hover transition-colors duration-200 group"
        >
          Mainkan Game
          <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform duration-200" />
        </a>

        {/* Back */}
        <Link
          href="/dashboard"
          prefetch={false}
          className="inline-block text-sm text-fg-subtle hover:text-fg transition-colors duration-150"
        >
          Kembali ke Dashboard
        </Link>
      </motion.div>
    </div>
  );
};

export default GameHealing;
