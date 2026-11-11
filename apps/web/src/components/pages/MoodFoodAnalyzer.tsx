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
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto p-8"
    >
      <div className="bg-white shadow-xl rounded-2xl p-8 space-y-8">
        <h2 className="text-3xl font-bold text-center flex items-center justify-center gap-2">
          <Sparkles className="w-6 h-6" />
          Mood + Food Analyzer
        </h2>

        {/* Mood Selection */}
        <div>
          <p className="font-semibold mb-4">Pilih Mood Kamu</p>
          <div className="grid grid-cols-3 gap-4">
            {moods.map((m) => (
              <button
                key={m.label}
                onClick={() => setMood(m.label)}
                className={`p-4 rounded-2xl text-2xl transition-all border ${
                  mood === m.label
                    ? "bg-black text-white scale-105"
                    : "bg-gray-50 hover:bg-gray-100"
                }`}
              >
                {m.emoji}
                <div className="text-sm mt-1">{m.label}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Upload Section */}
        <div className="space-y-4">
          <p className="font-semibold">Upload File atau Ambil Foto</p>

          <div className="flex gap-4">
            <button
              onClick={() => fileInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-4 rounded-2xl transition"
            >
              <Upload className="w-5 h-5" />
              Choose File
            </button>

            <button
              onClick={() => cameraInputRef.current?.click()}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 p-4 rounded-2xl transition"
            >
              <Camera className="w-5 h-5" />
              Take Photo
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
            <div className="mt-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={preview}
                alt="Preview"
                className="rounded-xl max-h-64 object-cover mx-auto shadow"
              />
            </div>
          )}
        </div>

        {/* Analyze Button */}
        <button
          onClick={analyze}
          className="w-full bg-black text-white py-4 rounded-2xl font-semibold text-lg hover:scale-[1.02] transition"
        >
          {loading ? "Analyzing..." : "Analyze Now"}
        </button>

        {/* Result */}
        {response && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-gray-50 p-6 rounded-2xl shadow-inner whitespace-pre-line leading-relaxed"
          >
            {response}
          </motion.div>
        )}
      </div>
    </motion.div>
  );
}
