"use client";

import React, { useState } from "react";
import Link from "next/link";
import { dassQuestions } from "@/data/dassQuestions";
import { calculateDASS, interpretDASS } from "@/utils/dassScoring";
import { CircleCheck, Info, MessageCircleHeart, HeartHandshake } from "lucide-react";

const getLevelStyle = (level: string) => {
  if (level === "Normal") return { bg: "#E8F3EE", text: "#1F5C43", icon: CircleCheck };
  if (level === "Ringan") return { bg: "#F3F1E2", text: "#5F5617", icon: Info };
  if (level === "Sedang") return { bg: "#FBEFDD", text: "#8A4B0F", icon: MessageCircleHeart };
  if (level === "Berat") return { bg: "#F8E4DA", text: "#94391A", icon: HeartHandshake };
  return { bg: "#F1E3EC", text: "#6E2A55", icon: HeartHandshake }; // Sangat Berat
};

const heavyLevels = ["Berat", "Sangat Berat"];

const TeleScreening = () => {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(
    Array(dassQuestions.length).fill(null),
  );
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ReturnType<typeof interpretDASS> | null>(
    null,
  );
  const [animate, setAnimate] = useState(false);

  const options = [
    "Tidak Pernah",
    "Kadang-kadang",
    "Cukup Sering",
    "Sering Sekali",
  ];

  const handleAnswer = (value: number) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);

    setAnimate(true);

    setTimeout(() => {
      if (current < dassQuestions.length - 1) {
        setCurrent(current + 1);
      } else {
        const scores = calculateDASS(updated as number[]);
        const interpretation = interpretDASS(scores);
        setResult(interpretation);
        setSubmitted(true);
      }
      setAnimate(false);
    }, 350);
  };

  const progress = ((current + 1) / dassQuestions.length) * 100;

  // ================= RESULT SCREEN =================
  if (submitted && result) {
    const dimensions = [
      { label: "Depresi", level: result.depressionLevel },
      { label: "Kecemasan", level: result.anxietyLevel },
      { label: "Stres", level: result.stressLevel },
    ];

    return (
      <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
        <div className="max-w-2xl w-full bg-surface border border-line rounded-xl p-8 shadow-md">
          <h2 className="text-2xl font-semibold text-fg text-center mb-2">
            Ringkasan Kondisi Emosional
          </h2>
          <p className="text-sm text-fg-muted text-center mb-8">
            Hasil ini bersifat rahasia dan hanya untuk refleksi pribadi kamu.
          </p>

          <div className="space-y-4">
            {dimensions.map(({ label, level }) => {
              const style = getLevelStyle(level);
              const Icon = style.icon;
              return (
                <div key={label}>
                  <div
                    className="flex items-center gap-3 p-4 rounded-lg"
                    style={{ backgroundColor: style.bg, color: style.text }}
                  >
                    <Icon size={20} />
                    <span className="text-sm font-medium">
                      {label}: <strong>{level}</strong>
                    </span>
                  </div>
                  {heavyLevels.includes(level) && (
                    <p className="mt-1 text-xs text-fg-muted px-1">
                      Pertimbangkan untuk berbicara dengan profesional kesehatan mental untuk dukungan lebih lanjut.
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          <div className="mt-6 p-4 rounded-md bg-tint border border-brand-200 text-sm text-fg leading-relaxed">
            {result.motivationMessage}
          </div>

          <Link
            href="/dashboard"
            prefetch={false}
            className="mt-6 w-full h-11 rounded-md bg-action text-white font-medium text-sm hover:bg-action-hover transition-colors duration-200 flex items-center justify-center"
          >
            Selesai &amp; Kembali ke Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // ================= QUESTION SCREEN =================
  return (
    <div className="min-h-screen bg-canvas flex items-center justify-center p-6">
      <div className="max-w-2xl w-full bg-surface border border-line rounded-xl p-8 shadow-md">
        <h2 className="text-xl font-semibold text-fg text-center mb-6">
          Tele-Screening
        </h2>

        <div className="h-1.5 bg-neutral-100 rounded-full mb-6 overflow-hidden">
          <div
            className="h-full bg-brand-500 transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-fg-subtle text-center mb-6">
          Pertanyaan {current + 1} dari {dassQuestions.length}
        </p>

        <div
          className={`transition-all duration-500 ${
            animate ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
          }`}
        >
          <p className="text-base font-medium text-fg text-center mb-8 leading-relaxed">
            {dassQuestions[current]?.text}
          </p>

          <div className="grid gap-3">
            {options.map((label, value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className="w-full p-4 rounded-md bg-surface border border-line text-sm text-fg text-left hover:border-line-strong hover:bg-sunken transition-all duration-150 focus-visible:outline-2 focus-visible:outline-action"
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TeleScreening;
