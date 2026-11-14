"use client";

import React, { useState } from "react";
import { Send, HeartHandshake } from "lucide-react";

const crisisKeywords = [
  "bunuh diri",
  "ingin mati",
  "tidak ingin hidup",
  "hopeless",
  "self harm",
];

type Message =
  | { role: "user"; content: string }
  | { role: "assistant"; content: string }
  | { role: "crisis" };

const AiCompanion = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Halo! Saya adalah Pendamping AI. Saya di sini untuk mendengarkan kamu.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const detectCrisis = (text: string) => {
    return crisisKeywords.some((keyword) =>
      text.toLowerCase().includes(keyword),
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = { role: "user", content: input };
    setMessages((prev) => [...prev, userMessage]);

    if (detectCrisis(input)) {
      setMessages((prev) => [...prev, { role: "crisis" }]);
      setInput("");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input }),
      });

      const data = await response.json();

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.reply },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Maaf, terjadi gangguan sistem. Silakan coba lagi nanti.",
        },
      ]);
    }

    setLoading(false);
    setInput("");
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="max-w-3xl mx-auto px-6 py-10">
      <h2 className="text-2xl font-semibold text-fg mb-6">AI Mental Support Companion</h2>

      <div className="border border-line rounded-lg bg-sunken h-[500px] overflow-y-auto p-4 space-y-3">
        {messages.map((msg, index) => {
          if (msg.role === "crisis") {
            return (
              <div key={index} className="bg-tint border border-brand-200 rounded-lg p-5 mr-auto max-w-[90%]">
                <div className="flex items-center gap-2 font-semibold text-fg-brand text-sm mb-2">
                  <HeartHandshake size={20} />
                  Kamu Tidak Sendirian
                </div>
                <p className="text-sm text-fg leading-relaxed">
                  Saya sangat prihatin mendengar itu. Kamu tidak sendirian — ada dukungan yang bisa dihubungi sekarang.
                </p>
                <div className="mt-3 pt-3 border-t border-brand-200">
                  <p className="text-xs text-fg-muted">Layanan dukungan 24 jam:</p>
                  <a href="tel:119" className="text-sm font-semibold text-fg-brand hover:underline mt-1 inline-block">
                    Healing119 — 119 ext. 8
                  </a>
                </div>
              </div>
            );
          }

          if (msg.role === "assistant") {
            return (
              <div key={index}>
                {index === 0 && (
                  <span className="text-xs font-semibold text-fg-subtle mb-1 block">Pendamping AI</span>
                )}
                <div className="mr-auto max-w-[80%] px-4 py-3 rounded-md bg-surface border border-line text-fg text-sm leading-relaxed shadow-xs">
                  {msg.content}
                </div>
              </div>
            );
          }

          // user
          return (
            <div key={index} className="ml-auto max-w-[80%] px-4 py-3 rounded-md bg-action text-white text-sm leading-relaxed">
              {msg.content}
            </div>
          );
        })}

        {loading && <p className="text-sm text-fg-subtle">AI sedang mengetik...</p>}
      </div>

      <div className="flex mt-4 gap-3">
        <input
          type="text"
          className="flex-1 h-11 border border-line-input rounded-md px-4 text-sm bg-surface text-fg placeholder:text-fg-subtle outline-none focus:border-brand-500 focus:ring-2 focus:ring-brand-200 transition-all"
          placeholder="Tulis perasaanmu..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <button
          onClick={sendMessage}
          className="h-11 w-11 flex items-center justify-center rounded-md bg-action text-white hover:bg-action-hover transition-colors duration-150"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AiCompanion;
