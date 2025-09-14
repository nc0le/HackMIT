import { z } from 'zod';

// Enum schemas
export const ConceptStatusSchema = z.enum(['unlearned', 'learning', 'mastered']);
export const ExerciseTypeSchema = z.enum(['flashcard', 'code', 'quiz']);

// Request validation schemas
export const CreatePromptSchema = z.object({
  prompt_text: z.string().min(1, 'Prompt text is required').max(10000, 'Prompt text too long'),
});

export const CreateConceptSchema = z.object({
  concept_name: z.string().min(1, 'Concept name is required').max(255, 'Concept name too long'),
  source_prompt_id: z.string().uuid().optional(),
  status: ConceptStatusSchema.optional(),
});

export const CreateExerciseSchema = z.object({
  concept_id: z.string().uuid('Invalid concept ID'),
  exercise_type: ExerciseTypeSchema,
  question: z.string().min(1, 'Question is required').max(5000, 'Question too long'),
  answer: z.string().min(1, 'Answer is required').max(5000, 'Answer too long'),
  ai_feedback: z.record(z.string(), z.any()).optional(),
  completed: z.boolean().optional(),
});

export const UpdateExerciseSchema = z.object({
  ai_feedback: z.record(z.string(), z.any()).optional(),
  completed: z.boolean().optional(),
}).refine(data => Object.keys(data).length > 0, {
  message: 'At least one field must be provided for update',
});

// Parameter validation schemas
export const UuidSchema = z.string().uuid('Invalid UUID format');
export const UserIdSchema = z.string().uuid('Invalid user ID format');

// Type exports
export type CreatePromptInput = z.infer<typeof CreatePromptSchema>;
export type CreateConceptInput = z.infer<typeof CreateConceptSchema>;
export type CreateExerciseInput = z.infer<typeof CreateExerciseSchema>;
export type UpdateExerciseInput = z.infer<typeof UpdateExerciseSchema>;

// AI-generated exercise schema
// export const GenerateExerciseSchema = z.object({
//   prompt_id: z.string().uuid('Invalid prompt ID format'),
//   exercise_type: ExerciseTypeSchema,
//   new_user_prompts: z.array(z.string().min(1, 'Prompt cannot be empty')).optional()
// });

export const GenerateExerciseSchema = z.object({
  user_id: z.string().uuid('Invalid user ID format'),
  new_user_prompts: z.array(z.string().min(1, 'Prompt cannot be empty')).min(1, 'At least one prompt is required'),
  exercise_type: ExerciseTypeSchema.optional().default('quiz')
});

// excess unnessary??
// // New user prompts exercise generation schema
// export const GenerateFromNewPromptsSchema = z.object({
//   user_id: z.string().uuid('Invalid user ID format'),
//   new_user_prompts: z.array(z.string().min(1, 'Prompt cannot be empty')).min(1, 'At least one prompt is required'),
//   exercise_type: ExerciseTypeSchema.optional().default('quiz'),
// });s

export type GenerateExerciseInput = z.infer<typeof GenerateExerciseSchema>;
//export type GenerateFromNewPromptsInput = z.infer<typeof GenerateFromNewPromptsSchema>;
