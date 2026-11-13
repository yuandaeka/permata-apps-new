"use client";

import React, { useState, useEffect } from "react";
import { useCulture } from "@/context/CultureContext";
import { Sparkles, Send, Heart, BookOpen, CheckCircle2 } from "lucide-react";

interface SavedJournalEntry {
  id: string;
  date: string;
  content: string;
  mood: number;
  culture: string;
  aiInsight?: string;
}

const Journal = () => {
  const { culture, theme } = useCulture();
  const [msg, setMsg] = useState("");
  const [mood, setMood] = useState(3);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [savedEntries, setSavedEntries] = useState<SavedJournalEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("permata_journal_entries");
      if (stored) {
        setSavedEntries(JSON.parse(stored));
      }
    } catch {
      // LocalStorage access fallback
    }
  }, []);

  const moods = [
    { value: 1, emoji: "😢", label: "Cemas/Takut" },
    { value: 2, emoji: "😔", label: "Sedih" },
    { value: 3, emoji: "😐", label: "Tenang/Biasa" },
    { value: 4, emoji: "🙂", label: "Bersyukur" },
    { value: 5, emoji: "🌟", label: "Penuh Harapan" },
  ];

  const handleAnalyze = () => {
    if (!msg.trim()) return;

    setIsAnalyzing(true);
    setTimeout(() => {
      let insight = "";
      if (culture === "Aceh") {
        insight =
          "Refleksi ini mencerminkan keteguhan hati ('Meuseuraya' dan kebersamaan). Setiap rasa takut dan duka yang kamu lalui sedang membentuk ketangguhan jiwa yang lebih kokoh.";
      } else {
        insight =
          "Nilai 'Mambangkik Batang Tarandam' hadir dalam ceritamu. Dari situasi yang sulit, kamu sedang menemukan kembali kekuatan baru untuk melangkah maju bersama keluarga dan teman.";
      }

      const newEntry: SavedJournalEntry = {
        id: Date.now().toString(),
        date: new Date().toLocaleDateString("id-ID", {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
        content: msg,
        mood,
        culture,
        aiInsight: insight,
      };

      const updated = [newEntry, ...savedEntries];
      setSavedEntries(updated);
      try {
        localStorage.setItem("permata_journal_entries", JSON.stringify(updated));
      } catch {
        // Fallback
      }

      setAiInsight(insight);
      setIsAnalyzing(false);
    }, 700);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 lg:p-10 space-y-8">
      <div className="bg-white rounded-[3rem] p-8 lg:p-12 shadow-2xl border border-black/5">
        <h2 className="text-3xl font-black flex items-center gap-3">
          <Sparkles className="text-yellow-500" /> Jurnal Hikmah
        </h2>
        <p className="mt-2 opacity-50 italic">
          Refleksi pemulihan berbasis kearifan lokal {culture}. Tempat aman untuk mengungkapkan perasaanmu.
        </p>

        {/* Mood Selector */}
        <div className="mt-8">
          <label className="text-xs font-black uppercase tracking-widest opacity-60 block mb-3">
            Bagaimana perasaanmu saat ini?
          </label>
          <div className="flex flex-wrap gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  mood === m.value
                    ? `${theme.btn} text-white border-transparent shadow-lg scale-105`
                    : "bg-gray-50 border-gray-200 opacity-80 hover:opacity-100"
                }`}
              >
                <span className="text-lg">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <textarea
          className="w-full h-56 mt-6 p-6 bg-gray-50 rounded-2xl border border-black/5 outline-none text-base leading-relaxed focus:bg-white focus:ring-2 focus:ring-green-600 transition-all"
          placeholder="Ceritakan apa yang kamu rasakan, alami, atau syukuri hari ini..."
          value={msg}
          onChange={(e) => setMsg(e.target.value)}
        />

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !msg.trim()}
          className={`mt-6 w-full py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl flex justify-center items-center gap-2 transition-all cursor-pointer ${
            !msg.trim()
              ? "bg-gray-200 text-gray-400 cursor-not-allowed"
              : `${theme.btn} text-white hover:opacity-90 active:scale-[0.99]`
          }`}
        >
          <Send size={18} />
          {isAnalyzing ? "Menganalisis Makna Pertumbuhan..." : "Simpan & Analisis Makna (AI)"}
        </button>

        {/* AI Insight Card */}
        {aiInsight && (
          <div className="mt-8 p-6 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 animate-fadeIn">
            <div className="flex items-center gap-2 font-black text-sm uppercase tracking-wider text-amber-800 mb-2">
              <Heart size={16} className="text-red-500" />
              <span>Refleksi Pertumbuhan Jiwa:</span>
            </div>
            <p className="text-sm leading-relaxed">{aiInsight}</p>
          </div>
        )}
      </div>

      {/* Saved Entries History */}
      {savedEntries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-[0.3em] opacity-40 italic flex items-center gap-2">
            <BookOpen size={16} /> Riwayat Refleksi
          </h3>
          <div className="space-y-4">
            {savedEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white/60 p-6 rounded-3xl border border-white shadow-sm space-y-3"
              >
                <div className="flex justify-between items-center text-xs opacity-50 font-bold">
                  <span>{entry.date}</span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={14} className="text-green-600" />
                    Tersimpan Aman ({entry.culture})
                  </span>
                </div>
                <p className="text-sm leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                {entry.aiInsight && (
                  <p className="text-xs italic bg-amber-50/60 p-3 rounded-xl border border-amber-100 text-amber-800">
                    💡 {entry.aiInsight}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Journal;
