"use client";

import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Upload, Camera, Sparkles } from "lucide-react";

export default function MoodFoodAnalyzer() {
  const [mood, setMood] = useState<string | null>(null);
  const [fileData, setFileData] = useState<{
    base64: string;
    mimeType: string;
  } | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [response, setResponse] = useState("");
  const [loading, setLoading] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const moods = [
    { label: "Sedih", emoji: "😢" },
    { label: "Marah", emoji: "😡" },
    { label: "Bahagia", emoji: "😄" },
  ];

  const handleFile = (file: File | undefined) => {
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const result = reader.result as string;
      const base64 = result.split(",")[1];
      setPreview(result);
      setFileData({
        base64,
        mimeType: file.type,
      });
    };
    reader.readAsDataURL(file);
  };

  const analyze = async () => {
    if (!mood || !fileData) {
      alert("Pilih mood dan upload / ambil foto dulu ya");
      return;
    }

    setLoading(true);
    setResponse("");

    try {
      const res = await fetch("/api/mood-food", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mood, file: fileData }),
      });

      const data = await res.json();
      setResponse(data.reply);
    } catch {
      setResponse("Terjadi kesalahan saat analisis.");
    }

    setLoading(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.32 }}
      className="max-w-3xl mx-auto px-6 py-10"
    >
      <div className="bg-surface border border-line rounded-xl p-6 md:p-8 shadow-xs space-y-6">
        <h2 className="text-2xl font-semibold text-fg flex items-center justify-center gap-2">
          <Sparkles size={20} className="text-fg-brand" />
          Mood + Food Analyzer
        </h2>

        {/* Mood Selection */}
        <div>
          <span className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase mb-3 block">
            Pilih Mood Kamu
          </span>
          <div
            className="grid grid-cols-3 gap-3"
            role="radiogroup"
            aria-label="Pilih mood"
          >
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                aria-pressed={mood === m.label}
                className={
                  mood === m.label
                    ? "flex flex-col items-center gap-1 p-4 rounded-lg border-2 border-brand-600 bg-tint text-fg-brand transition-all duration-150"
                    : "flex flex-col items-center gap-1 p-4 rounded-lg border border-line bg-surface text-fg text-2xl hover:border-line-strong hover:bg-sunken transition-all duration-150"
                }
              >
                <span className="text-2xl">{m.emoji}</span>
                <span className="text-sm font-medium">{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div>
          <span className="text-xs font-semibold tracking-[0.06em] text-fg-subtle uppercase mb-3 block">
            Upload File atau Ambil Foto
          </span>

          <div className="flex gap-3">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-md border border-line-strong bg-surface text-sm font-medium text-fg hover:bg-sunken transition-colors duration-150"
            >
              <Upload size={16} />
              Pilih File
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 h-11 rounded-md border border-line-strong bg-surface text-sm font-medium text-fg hover:bg-sunken transition-colors duration-150"
            >
              <Camera size={16} />
              Ambil Foto
            </button>
          </div>

          <input
            type="file"
            accept="image/*,.pdf"
            ref={fileInputRef}
            onChange={(e) => handleFile(e.target.files?.[0])}
            hidden
          />

          <input
            type="file"
            accept="image/*"
            capture="environment"
            ref={cameraInputRef}
            onChange={(e) => handleFile(e.target.files?.[0])}
            hidden
          />

          {preview && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={preview}
              alt="Preview"
              className="rounded-lg border border-line shadow-xs max-h-64 object-cover mx-auto mt-4 block"
            />
          )}
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyze}
          className="w-full h-11 rounded-md bg-action text-white font-medium text-sm hover:bg-action-hover transition-colors duration-200"
        >
          {loading ? "Menganalisis…" : "Analisis Sekarang"}
        </button>

        {/* Result */}
        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.2 }}
            className="bg-sunken border border-line rounded-lg p-5 text-sm text-fg leading-relaxed whitespace-pre-line"
          >
            {response}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
