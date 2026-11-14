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
  const { culture } = useCulture();
  const [msg, setMsg] = useState("");
  const [mood, setMood] = useState(3);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiInsight, setAiInsight] = useState<string | null>(null);
  const [savedEntries, setSavedEntries] = useState<SavedJournalEntry[]>([]);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("permata_journal_entries");
      if (stored) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
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
      if (culture === "aceh") {
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
    <div className="max-w-3xl mx-auto px-6 py-10 space-y-8">
      <div className="bg-surface border border-line rounded-xl p-6 md:p-8 shadow-xs">
        <h2 className="text-2xl font-semibold text-fg flex items-center gap-2">
          <Sparkles size={20} className="text-fg-brand" /> Jurnal Hikmah
        </h2>
        <p className="mt-2 text-sm text-fg-muted">
          Refleksi pemulihan berbasis kearifan lokal {culture === "aceh" ? "Aceh" : "Sumatera Barat"}. Tempat aman untuk mengungkapkan perasaanmu.
        </p>

        {/* Mood Selector */}
        <div className="mt-8">
          <label className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase block mb-3">
            Bagaimana perasaanmu saat ini?
          </label>
          <div className="flex flex-wrap gap-3">
            {moods.map((m) => (
              <button
                key={m.value}
                type="button"
                onClick={() => setMood(m.value)}
                className={
                  mood === m.value
                    ? "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium border-2 border-brand-600 bg-tint text-fg-brand transition-all duration-150"
                    : "flex items-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium border border-line bg-surface text-fg-muted hover:border-line-strong hover:text-fg transition-all duration-150"
                }
              >
                <span className="text-lg">{m.emoji}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Textarea */}
        <div className="mt-4">
          <label
            htmlFor="journal-content"
            className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase block mb-2"
          >
            Ceritakan perasaanmu
          </label>
          <textarea
            id="journal-content"
            className="w-full min-h-[160px] p-4 bg-sunken rounded-md border border-line-input text-fg text-base leading-relaxed resize-none outline-none placeholder:text-fg-subtle focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
            placeholder="Ceritakan apa yang kamu rasakan, alami, atau syukuri hari ini..."
            value={msg}
            onChange={(e) => setMsg(e.target.value)}
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={isAnalyzing || !msg.trim()}
          className={`mt-4 w-full h-11 rounded-md font-medium text-base flex justify-center items-center gap-2 transition-colors duration-200 ${
            isAnalyzing || !msg.trim()
              ? "bg-sunken text-neutral-400 cursor-not-allowed"
              : "bg-action text-white hover:bg-action-hover"
          }`}
        >
          <Send size={18} />
          {isAnalyzing ? "Menganalisis…" : "Simpan & Analisis Makna (AI)"}
        </button>

        {/* AI Insight Card */}
        {aiInsight && (
          <div className="mt-6 p-4 rounded-sm bg-accent-50 border border-accent-200 text-fg">
            <div className="flex items-center gap-2 text-sm font-semibold text-fg-accent mb-2">
              <Heart size={16} />
              <span>Refleksi Pertumbuhan Jiwa:</span>
            </div>
            <p className="text-sm text-fg leading-relaxed">{aiInsight}</p>
          </div>
        )}
      </div>

      {/* Saved Entries History */}
      {savedEntries.length > 0 && (
        <div className="space-y-4">
          <h3 className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase flex items-center gap-2">
            <BookOpen size={16} /> Riwayat Refleksi
          </h3>
          <div className="space-y-4">
            {savedEntries.map((entry) => (
              <div
                key={entry.id}
                className="bg-surface border border-line rounded-lg p-5 shadow-xs space-y-3"
              >
                <div className="flex justify-between items-center text-xs text-fg-subtle">
                  <span>{entry.date}</span>
                  <span className="flex items-center gap-1 text-xs text-fg-brand">
                    <CheckCircle2 size={14} />
                    Tersimpan Aman ({entry.culture === "aceh" ? "Aceh" : entry.culture === "sumbar" ? "Sumbar" : entry.culture})
                  </span>
                </div>
                <p className="text-sm text-fg leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                {entry.aiInsight && (
                  <p className="text-xs text-fg-subtle bg-accent-50 p-3 rounded-sm border border-accent-200">
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
