import { GoogleGenerativeAI } from "@google/generative-ai";
import { NextRequest, NextResponse } from "next/server";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(req: NextRequest) {
  try {
    const { mood, file } = await req.json();

    if (!mood || !file || !file.base64) {
      return NextResponse.json(
        { reply: "Mood and file required." },
        { status: 400 },
      );
    }

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
    });

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: `
Mood Pengguna: ${mood}

Analisis file yang dilampirkan.

Jika berupa gambar makanan:
- Identifikasi makanannya
- Jelaskan dampak nutrisinya
- Hubungkan dengan kondisi mood
- Berikan saran suportif

Jika berupa dokumen:
- Ringkas secara singkat
- Hubungkan dengan kesadaran emosional

Gunakan bahasa Indonesia yang hangat, suportif, dan tidak menghakimi serta buat yang tidak terlalu panjang.
`,
            },
            {
              inlineData: {
                mimeType: file.mimeType || "image/jpeg",
                data: file.base64,
              },
            },
          ],
        },
      ],
    });

    const reply = result.response.text();

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("MOOD FOOD ERROR:", error);
    return NextResponse.json({ reply: "Analisis Gagal." }, { status: 500 });
  }
}
