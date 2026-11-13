import { describe, it, expect, vi, beforeEach } from 'vitest';
import { aiService } from '../src/modules/smart-technology/ai.service';
import { prisma } from '../src/config/database';
import { getAIProvider } from '../src/modules/smart-technology/ai.provider';
import { ForbiddenError, NotFoundError } from '../src/common/errors';

vi.mock('../src/config/database', () => ({
  prisma: {
    aIConversation: {
      create: vi.fn(),
      findUnique: vi.fn(),
    },
    aIMessage: {
      create: vi.fn(),
    },
    aIUsageLog: {
      create: vi.fn(),
    },
  },
}));

vi.mock('../src/modules/audit/audit.service', () => ({
  auditService: {
    log: vi.fn().mockResolvedValue(undefined),
  },
}));

vi.mock('../src/modules/smart-technology/ai.provider', () => ({
  getAIProvider: vi.fn(),
}));

describe('AI Guardrails and Companion Safety (SMART-01)', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('PII Sanitization', () => {
    it('redacts telephone numbers and email addresses before sending payload to AI provider', async () => {
      const mockGenerateResponse = vi.fn().mockResolvedValue({
        content: 'Halo teman! Senang bisa mengobrol denganmu hari ini.',
        tokensUsed: 42,
        modelName: 'mock-gemini-flash',
      });

      (getAIProvider as any).mockReturnValue({
        generateResponse: mockGenerateResponse,
      });

      const conversationId = 'conv-safe-1';
      const userId = 'user-child-1';

      (prisma.aIConversation.findUnique as any).mockResolvedValue({
        id: conversationId,
        userId,
        messages: [],
      });

      (prisma.aIMessage.create as any)
        .mockResolvedValueOnce({ id: 'msg-user-1', role: 'USER' })
        .mockResolvedValueOnce({ id: 'msg-asst-1', role: 'ASSISTANT' });

      (prisma.aIUsageLog.create as any).mockResolvedValue({ id: 'usage-1' });

      const rawInput = 'Halo teman, nomor telepon ayahku 081234567890 dan email sekolahku murid@sekolah.sch.id';
      await aiService.sendMessage(conversationId, rawInput, userId);

      expect(mockGenerateResponse).toHaveBeenCalledTimes(1);
      const passedMessages = mockGenerateResponse.mock.calls[0][0];
      const userMessageInPayload = passedMessages.find((m: any) => m.role === 'user');

      expect(userMessageInPayload).toBeDefined();
      expect(userMessageInPayload.content).not.toContain('081234567890');
      expect(userMessageInPayload.content).not.toContain('murid@sekolah.sch.id');
      expect(userMessageInPayload.content).toContain('[NOMOR_TELEPON]');
      expect(userMessageInPayload.content).toContain('[EMAIL]');
    });
  });

  describe('Distress Trigger Interception', () => {
    it('intercepts suicidal and acute distress triggers with immediate hotline support without calling external AI model', async () => {
      const mockGenerateResponse = vi.fn();
      (getAIProvider as any).mockReturnValue({
        generateResponse: mockGenerateResponse,
      });

      const conversationId = 'conv-crisis-1';
      const userId = 'user-child-distress';

      (prisma.aIConversation.findUnique as any).mockResolvedValue({
        id: conversationId,
        userId,
        messages: [],
      });

      (prisma.aIMessage.create as any)
        .mockResolvedValueOnce({ id: 'msg-u-distress', role: 'USER' })
        .mockImplementationOnce((args: any) => Promise.resolve({ id: 'msg-a-crisis', ...args.data }));

      (prisma.aIUsageLog.create as any).mockResolvedValue({ id: 'usage-crisis' });

      const crisisInput = 'Aku merasa putus asa dan ingin bunuh diri saja';
      const result = await aiService.sendMessage(conversationId, crisisInput, userId);

      // Provider must not be called
      expect(mockGenerateResponse).not.toHaveBeenCalled();

      // Crisis message must provide official child emergency hotlines (117 and 1500-771)
      expect(result.reply.content).toContain('117');
      expect(result.reply.content).toContain('1500-771');
      expect(result.reply.content).toContain('Sahabat Anak');
      expect(result.reply.modelName).toBe('guardrail-safety');
    });
  });

  describe('Authorization and Boundary Checks', () => {
    it('prevents non-owner users from sending messages to an existing conversation', async () => {
      (prisma.aIConversation.findUnique as any).mockResolvedValue({
        id: 'conv-owner-only',
        userId: 'original-owner-uuid',
        messages: [],
      });

      await expect(
        aiService.sendMessage('conv-owner-only', 'Halo', 'unauthorized-intruder-uuid')
      ).rejects.toThrow(ForbiddenError);
    });

    it('throws NotFoundError for non-existent conversation', async () => {
      (prisma.aIConversation.findUnique as any).mockResolvedValue(null);

      await expect(
        aiService.sendMessage('conv-missing', 'Halo', 'user-any')
      ).rejects.toThrow(NotFoundError);
    });
  });
});

