import React, { useState } from "react";
import { dassQuestions } from "../Data/dassQuestions";
import { calculateDASS, interpretDASS } from "../Utils/dassScoring";
import { useNavigate } from "react-router-dom";

const TeleScreening = () => {
  const navigate = useNavigate();

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState(
    Array(dassQuestions.length).fill(null)
  );
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [animate, setAnimate] = useState(false);

  const options = [
    "Tidak Pernah",
    "Kadang-kadang",
    "Cukup Sering",
    "Sering Sekali",
  ];

  const handleAnswer = (value) => {
    const updated = [...answers];
    updated[current] = value;
    setAnswers(updated);

    setAnimate(true);

    setTimeout(() => {
      if (current < dassQuestions.length - 1) {
        setCurrent(current + 1);
      } else {
        const scores = calculateDASS(updated);
        const interpretation = interpretDASS(scores);
        setResult(interpretation);
        setSubmitted(true);
      }
      setAnimate(false);
    }, 350);
  };

  const progress =
    ((current + 1) / dassQuestions.length) * 100;

  const getColor = (level) => {
    if (level === "Normal") return "bg-green-100 text-green-700";
    if (level === "Ringan") return "bg-yellow-100 text-yellow-700";
    if (level === "Sedang") return "bg-orange-100 text-orange-700";
    if (level === "Berat") return "bg-red-100 text-red-700";
    return "bg-red-200 text-red-800";
  };

  // ================= RESULT SCREEN =================
  if (submitted && result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 p-8">
        <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg p-10 rounded-[3rem] shadow-2xl animate-fadeIn">

          <h2 className="text-3xl font-extrabold text-center text-indigo-700 mb-4">
            Ringkasan Kondisi Emosional
          </h2>

          <p className="text-center text-gray-500 mb-10">
            Hasil ini bersifat rahasia dan hanya untuk refleksi pribadi Anda.
          </p>

          <div className="space-y-6 text-center text-lg">

            <div className={`p-4 rounded-2xl ${getColor(result.depressionLevel)}`}>
              Depresi: <strong>{result.depressionLevel}</strong>
            </div>

            <div className={`p-4 rounded-2xl ${getColor(result.anxietyLevel)}`}>
              Anxiety: <strong>{result.anxietyLevel}</strong>
            </div>

            <div className={`p-4 rounded-2xl ${getColor(result.stressLevel)}`}>
              Stress: <strong>{result.stressLevel}</strong>
            </div>

          </div>

          <div className="mt-8 p-6 rounded-3xl bg-white shadow-inner text-center">
            <p className="text-gray-700 font-medium leading-relaxed">
              {result.motivationMessage}
            </p>
          </div>

          <button
            onClick={() => navigate("/dashboard")}
            className="mt-10 w-full py-3 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-semibold hover:scale-105 transition-all duration-300"
          >
            Selesai & Kembali ke Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ================= QUESTION SCREEN =================
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 p-6">
      <div className="max-w-2xl w-full bg-white/80 backdrop-blur-lg p-10 rounded-[3rem] shadow-xl">

        <h2 className="text-xl font-bold text-indigo-700 text-center mb-6">
          Tele-Screening
        </h2>

        <div className="h-3 bg-white rounded-full mb-8 overflow-hidden shadow-inner">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>

        <p className="text-sm text-gray-500 text-center mb-6">
          Pertanyaan {current + 1} dari {dassQuestions.length}
        </p>

        <div
          className={`text-center transition-all duration-500 ${
            animate ? "opacity-0 translate-x-10" : "opacity-100 translate-x-0"
          }`}
        >
          <p className="text-lg font-semibold text-gray-700 mb-8">
            {dassQuestions[current]?.text}
          </p>

          <div className="grid gap-4">
            {options.map((label, value) => (
              <button
                key={value}
                onClick={() => handleAnswer(value)}
                className="p-3 rounded-2xl bg-white shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300 border border-gray-200 hover:bg-indigo-50"
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