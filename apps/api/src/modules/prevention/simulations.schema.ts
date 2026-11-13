import { z } from 'zod';

export const simulationResponseSchema = z.object({
  stepId: z.string().uuid(),
  selectedOptionId: z.string().uuid(),
  timeSpentSeconds: z.number().int().min(0).optional(),
});

export const simulationAttemptSchema = z.object({
  scenarioId: z.string().uuid(),
});

export type SimulationResponseDto = z.infer<typeof simulationResponseSchema>;
