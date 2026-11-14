"use client";

import React from "react";
import { Sparkles } from "lucide-react";

const RoleplayPsy = () => {
  return (
    <div className="min-h-[80vh] flex items-center justify-center">
      <div className="bg-emphasis text-white rounded-xl p-10 md:p-14 max-w-md w-full mx-6 text-center shadow-lg">
        <Sparkles size={40} className="text-accent-200 mb-6 mx-auto" />
        <h1 className="text-2xl font-semibold text-white mb-3">
          Roleplay Psikoedukasi
        </h1>
        <p className="text-sm text-white/75 leading-relaxed">
          Simulasi naratif interaktif untuk membangun ketangguhan mental melalui skenario psikoedukasi berbasis kearifan lokal.
        </p>
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-white text-xs font-medium mt-6">
          Segera Hadir
        </span>
      </div>
    </div>
  );
};

export default RoleplayPsy;
