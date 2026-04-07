import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ reply: "Message is required." });
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      systemInstruction: `
Kamu adalah Pendamping Dukungan Mental.

Aturan:
- Jangan mendiagnosis kondisi medis atau psikologis.
- Jangan menggantikan peran profesional atau terapi.
- Berikan respons dengan empati dan validasi emosi.
- Jika diperlukan, sarankan mencari bantuan profesional.
- Gunakan bahasa Indonesia yang hangat, lembut, dan suportif.
- Hindari bahasa yang terlalu klinis atau kaku.
`
    });

    const result = await model.generateContent(message);

    const reply = result.response.text();

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 CHAT ERROR:", error);
    return res.status(500).json({ reply: "AI error occurred." });
  }
}