import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { message } = await req.json();

    if (!message) {
      return NextResponse.json(
        { reply: "Message is required." },
        { status: 400 },
      );
    }

    const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { reply: "Konfigurasi GEMINI_API_KEY belum diatur pada server." },
        { status: 500 },
      );
    }

    const genAI = new GoogleGenerativeAI(apiKey);
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
`,
    });

    const result = await model.generateContent(message);
    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("CHAT ERROR:", error);
    return NextResponse.json({ reply: "AI error occurred." }, { status: 500 });
  }
}
