import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ reply: "Method Not Allowed" });
  }

  try {
    const { mood, file } = req.body;

    if (!mood || !file || !file.base64) {
      return res.status(400).json({ reply: "Mood and file required." });
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
`
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

    return res.status(200).json({ reply });

  } catch (error) {
    console.error("🔥 MOOD FOOD ERROR:", error);
    return res.status(500).json({ reply: "Analisis Gagal." });
  }
}