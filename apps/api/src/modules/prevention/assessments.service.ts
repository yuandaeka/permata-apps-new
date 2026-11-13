import { prisma } from '../../config/database';
import { ForbiddenError, NotFoundError } from '../../common/errors';

export const assessmentsService = {
  async list(query: { ageGroup?: string; language?: string }) {
    return prisma.assessment.findMany({
      where: { isActive: true },
      select: { id: true, title: true, description: true, targetAgeGroup: true, estimatedMinutes: true },
    });
  },

  async getById(assessmentId: string) {
    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, isActive: true },
      include: {
        currentVersion: {
          include: {
            questions: {
              include: { options: true },
              orderBy: { orderIndex: 'asc' },
            },
          },
        },
      },
    });
    if (!assessment) throw new NotFoundError('Assessment', assessmentId);
    return assessment;
  },

  async submit(assessmentId: string, childId: string, responses: Array<{ questionId: string; optionId: string }>) {
    const assessment = await prisma.assessment.findFirst({
      where: { id: assessmentId, isActive: true },
      include: { currentVersion: { include: { questions: { include: { options: true } } } } },
    });
    if (!assessment || !assessment.currentVersion) throw new NotFoundError('Assessment', assessmentId);

    const submission = await prisma.$transaction(async (tx) => {
      const sub = await tx.assessmentSubmission.create({
        data: {
          childId,
          assessmentId,
          assessmentVersionId: assessment.currentVersionId!,
          status: 'COMPLETED',
          completedAt: new Date(),
        },
      });

      for (const r of responses) {
        await tx.assessmentResponse.create({
          data: { submissionId: sub.id, questionId: r.questionId, optionId: r.optionId },
        });
      }

      // Apply recommendation rules
      const rules = await tx.recommendationRule.findMany({
        where: { assessmentVersionId: assessment.currentVersionId! },
      });

      const selectedOptionIds = responses.map(r => r.optionId);
      const matchedRules = rules.filter(rule => {
        // Simple tag-based matching: check if any selected option matches rule criteria
        const criteria = rule.criteria as any;
        if (!criteria) return false;
        return selectedOptionIds.some(id => criteria.optionIds?.includes(id));
      });

      for (const rule of matchedRules) {
        await tx.assessmentRecommendation.create({
          data: { submissionId: sub.id, ruleId: rule.id, recommendationType: rule.recommendationType, content: rule.recommendationContent as any },
        });
      }

      return sub;
    });

    return submission;
  },

  async getResult(submissionId: string, childId: string, roles: string[]) {
    const submission = await prisma.assessmentSubmission.findUnique({
      where: { id: submissionId },
      include: {
        recommendations: true,
        assessment: { select: { title: true } },
      },
    });
    if (!submission) throw new NotFoundError('Submission', submissionId);

    // Only the child or authorized roles can see assessment results
    const isOwner = submission.childId === childId;
    const isAuthorized = roles.some(r => ['SUPER_ADMIN', 'PROFESSIONAL', 'TEACHER_COUNSELOR'].includes(r));
    if (!isOwner && !isAuthorized) throw new ForbiddenError('Access denied');

    return {
      submission,
      // Results are framed as educational recommendations, never clinical diagnoses
      recommendations: submission.recommendations,
    };
  },
};
