import React, { useState } from "react";
import { Send } from "lucide-react";

const crisisKeywords = [
  "bunuh diri",
  "ingin mati",
  "tidak ingin hidup",
  "hopeless",
  "self harm"
];

const AiCompanion = () => {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Halo 🌿 Saya adalah Mental Support Companion. Saya di sini untuk mendengarkan Anda."
    }
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const detectCrisis = (text) => {
    return crisisKeywords.some(keyword =>
      text.toLowerCase().includes(keyword)
    );
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    setMessages(prev => [...prev, userMessage]);

    if (detectCrisis(input)) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Saya sangat prihatin mendengar itu. Anda tidak sendirian. Jika Anda merasa dalam bahaya, mohon segera hubungi layanan darurat atau profesional kesehatan mental terdekat. Di Indonesia Anda dapat menghubungi hotline 119."
        }
      ]);
      setInput("");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: input })
      });

      const data = await response.json();

      setMessages(prev => [
        ...prev,
        { role: "assistant", content: data.reply }
      ]);
    } catch (error) {
      setMessages(prev => [
        ...prev,
        {
          role: "assistant",
          content:
            "Maaf, terjadi gangguan sistem. Silakan coba lagi nanti."
        }
      ]);
    }

    setLoading(false);
    setInput("");
  };

  return (
    <div className="min-h-screen bg-white p-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-black mb-6">
        🤖 AI Mental Support Companion
      </h2>

      <div className="border rounded-3xl p-6 h-[500px] overflow-y-auto bg-gray-50">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`mb-4 ${
              msg.role === "user" 
                ? "text-right"
                : "text-left"
            }`}
          >
            <div
              className={`inline-block px-4 py-3 rounded-2xl ${
                msg.role === "user"
                  ? "bg-black text-white"
                  : "bg-white shadow"
              }`}
            >
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <p className="text-sm opacity-50">AI sedang mengetik...</p>
        )}
      </div>

      <div className="flex mt-6 gap-4">
        <input
          type="text"
          className="flex-1 border rounded-2xl px-4 py-3"
          placeholder="Tulis perasaan Anda..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={sendMessage}
          className="bg-black text-white px-6 rounded-2xl"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};

export default AiCompanion;