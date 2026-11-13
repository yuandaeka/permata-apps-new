import { env } from '../../config/env';
import { logger } from '../../config/logger';

export interface AIChatMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface AIProviderResponse {
  content: string;
  tokensUsed?: number;
  modelName: string;
}

export interface AIProvider {
  generateResponse(messages: AIChatMessage[]): Promise<AIProviderResponse>;
}

export class MockAIProvider implements AIProvider {
  async generateResponse(messages: AIChatMessage[]): Promise<AIProviderResponse> {
    const lastUserMessage = messages.filter(m => m.role === 'user').pop()?.content.toLowerCase() ?? '';

    let content = 'Halo! Aku Teman PERMATA. Aku siap menemanimu belajar tentang cara menjaga diri dan saling membantu saat terjadi bencana. Ada yang ingin kamu ceritakan atau tanyakan hari ini?';

    if (lastUserMessage.includes('gempa') || lastUserMessage.includes('earthquake')) {
      content = 'Jika terjadi gempa bumi, ingat langkah keselamatan sederhana: Merunduk (Drop), Lindungi Kepala (Cover), dan Bertahan (Hold on) di bawah meja yang kokoh. Jauhi jendela kaca ya!';
    } else if (lastUserMessage.includes('banjir') || lastUserMessage.includes('flood')) {
      content = 'Saat banjir, selalu ikuti arahan orang dewasa dan mengungsi ke tempat yang lebih tinggi. Jangan pernah bermain di air banjir karena arusnya bisa berbahaya.';
    } else if (lastUserMessage.includes('takut') || lastUserMessage.includes('sedih') || lastUserMessage.includes('scared')) {
      content = 'Wajar sekali merasa takut atau sedih setelah mengalami kejadian besar seperti bencana. Kamu sangat berani sudah mau menceritakannya. Coba tarik napas perlahan ya: tarik 4 hitungan, tahan, dan hembuskan perlahan.';
    }

    return {
      content,
      tokensUsed: 42,
      modelName: 'mock-permata-v1',
    };
  }
}

export class GeminiAIProvider implements AIProvider {
  private apiKey: string;
  private model: string;

  constructor(apiKey: string, model = 'gemini-2.5-flash') {
    this.apiKey = apiKey;
    this.model = model;
  }

  async generateResponse(messages: AIChatMessage[]): Promise<AIProviderResponse> {
    try {
      const url = `https://generativelanguage.googleapis.com/v1beta/models/${this.model}:generateContent?key=${this.apiKey}`;

      const contents = messages
        .filter(m => m.role !== 'system')
        .map(m => ({
          role: m.role === 'assistant' ? 'model' : 'user',
          parts: [{ text: m.content }],
        }));

      const systemInstruction = messages.find(m => m.role === 'system');

      const body: any = { contents };
      if (systemInstruction) {
        body.systemInstruction = { parts: [{ text: systemInstruction.content }] };
      }

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        throw new Error(`Gemini API error: ${response.status} ${response.statusText}`);
      }

      const data: any = await response.json();
      const content = data.candidates?.[0]?.content?.parts?.[0]?.text ?? 'Maaf, aku sedang tidak bisa menjawab saat ini. Coba lagi nanti ya!';
      const tokensUsed = data.usageMetadata?.totalTokenCount ?? 0;

      return {
        content,
        tokensUsed,
        modelName: this.model,
      };
    } catch (err) {
      logger.error('Gemini provider error, falling back to safe local response', { error: err });
      const fallback = new MockAIProvider();
      return fallback.generateResponse(messages);
    }
  }
}

export function getAIProvider(): AIProvider {
  if (env.AI_API_KEY && env.AI_PROVIDER === 'gemini') {
    return new GeminiAIProvider(env.AI_API_KEY, env.AI_MODEL ?? 'gemini-2.5-flash');
  }
  return new MockAIProvider();
}
