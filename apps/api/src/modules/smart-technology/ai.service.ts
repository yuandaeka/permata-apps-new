import { prisma } from '../../config/database';
import { getAIProvider, AIChatMessage } from './ai.provider';
import { ForbiddenError, NotFoundError } from '../../common/errors';
import { auditService } from '../audit/audit.service';

const SYSTEM_PROMPT = `Kamu adalah Teman PERMATA, asisten pendamping anak yang ramah, hangat, dan suportif dalam konteks kesiapsiagaan dan pemulihan bencana di Indonesia.

ATURAN KESELAMATAN MUTLAK:
1. Kamu BUKAN dokter, psikolog, atau konselor klinis. JANGAN PERNAH membuat diagnosis medis/kejiwaan, menyebut istilah gangguan jiwa, atau memberikan terapi klinis.
2. Selalu gunakan bahasa yang ramah anak, positif, mudah dipahami, dan menguatkan.
3. Berikan informasi kesiapsiagaan bencana berdasarkan panduan resmi yang aman (seperti Merunduk, Lindungi Kepala, Bertahan saat gempa).
4. Jika anak merasa sedih, takut, atau cemas, berikan validasi perasaan yang lembut dan ajak latihan pernapasan sederhana (tarik napas perlahan, hembuskan perlahan).
5. Selalu anjurkan anak untuk berbicara dan berbagi cerita dengan orang tua, guru, atau orang dewasa yang mereka percayai.
6. Jika anak menyampaikan bahaya langsung atau situasi darurat, arahkan mereka untuk segera memberi tahu orang dewasa di sekitar atau menghubungi layanan darurat.`;

function sanitizePII(text: string): string {
  // Strip phone numbers
  const noPhone = text.replace(/(\+?62|0)[0-9]{8,13}/g, '[NOMOR_TELEPON]');
  // Strip email addresses
  const noEmail = noPhone.replace(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g, '[EMAIL]');
  return noEmail;
}

const DISTRESS_KEYWORDS = ['ingin mati', 'bunuh diri', 'menyakiti diri', 'tidak kuat lagi', 'tolong aku disiksa'];

export const aiService = {
  async createConversation(userId: string, childId?: string, title?: string, context?: string) {
    const conversation = await prisma.aIConversation.create({
      data: {
        userId,
        childId,
        title: title ?? 'Percakapan Teman PERMATA',
        context: context ?? 'GENERAL',
      },
    });

    await auditService.log({
      actorId: userId,
      action: 'AI_CONVERSATION_CREATE',
      resourceType: 'AIConversation',
      resourceId: conversation.id,
    });

    return conversation;
  },

  async sendMessage(conversationId: string, content: string, userId: string) {
    const conversation = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: { orderBy: { createdAt: 'asc' }, take: 20 },
      },
    });

    if (!conversation) throw new NotFoundError('AI Conversation', conversationId);
    if (conversation.userId !== userId) throw new ForbiddenError('Not your conversation');

    // Save user message
    const userMsg = await prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'USER',
        content,
      },
    });

    // Check for extreme distress triggers
    const lowerContent = content.toLowerCase();
    const hasDistressTrigger = DISTRESS_KEYWORDS.some(k => lowerContent.includes(k));

    let aiReplyText = '';
    let tokensUsed = 0;
    let modelName = 'guardrail-safety';

    if (hasDistressTrigger) {
      aiReplyText = 'Aku sangat peduli dengan keselamatanmu. Kamu sangat berharga dan tidak sendirian. Tolong segera bicara langsung dengan orang tua, guru, atau orang dewasa terdekat yang kamu percayai sekarang juga, ya. Jika kamu butuh bantuan segera, kamu juga bisa menghubungi Sahabat Anak di 117 atau Telepon Pelayanan Sosial Anak di 1500-771.';
    } else {
      // Build sanitized messages payload
      const messagesPayload: AIChatMessage[] = [
        { role: 'system', content: SYSTEM_PROMPT },
        ...conversation.messages.map((m: any) => ({
          role: (m.role.toLowerCase() === 'assistant' ? 'assistant' : 'user') as 'user' | 'assistant',
          content: sanitizePII(m.content),
        })),
        { role: 'user', content: sanitizePII(content) },
      ];

      const provider = getAIProvider();
      const response = await provider.generateResponse(messagesPayload);
      aiReplyText = response.content;
      tokensUsed = response.tokensUsed ?? 0;
      modelName = response.modelName;
    }

    // Save assistant reply
    const assistantMsg = await prisma.aIMessage.create({
      data: {
        conversationId,
        role: 'ASSISTANT',
        content: aiReplyText,
        tokensUsed,
        modelName,
      },
    });

    // Record usage log
    await prisma.aIUsageLog.create({
      data: {
        conversationId,
        userId,
        promptTokens: Math.round(content.length / 4),
        completionTokens: Math.round(aiReplyText.length / 4),
        totalTokens: tokensUsed || Math.round((content.length + aiReplyText.length) / 4),
        modelName,
      },
    });

    await auditService.log({
      actorId: userId,
      action: 'AI_MESSAGE_SENT',
      resourceType: 'AIConversation',
      resourceId: conversationId,
      metadata: { modelName, tokensUsed },
    });

    return {
      userMessage: userMsg,
      reply: assistantMsg,
    };
  },

  async getConversation(conversationId: string, userId: string) {
    const conversation = await prisma.aIConversation.findUnique({
      where: { id: conversationId },
      include: {
        messages: { orderBy: { createdAt: 'asc' } },
      },
    });

    if (!conversation) throw new NotFoundError('AI Conversation', conversationId);
    if (conversation.userId !== userId) throw new ForbiddenError('Not your conversation');

    return conversation;
  },

  async recordFeedback(conversationId: string, rating: number, comment?: string, userId?: string) {
    await auditService.log({
      actorId: userId ?? 'ANONYMOUS',
      action: 'AI_FEEDBACK_RECORD',
      resourceType: 'AIConversation',
      resourceId: conversationId,
      metadata: { rating, comment },
    });

    return { message: 'Feedback recorded' };
  },
};
