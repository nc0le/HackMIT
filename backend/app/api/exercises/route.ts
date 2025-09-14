import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { CreateExerciseSchema, GenerateExerciseSchema } from '@/lib/validations';
import { ExerciseInsert } from '@/types/database';
import { generateConceptSummary, generateExercise } from '@/lib/claude';

/*

user_id: string
body.new_user_prompts: string[]
handleAIGeneration(request, body.user_id, body.new_user_prompts)
*/
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // return await handleAIGeneration(request, body.user_id, body.new_user_prompts);
    
    // MOVED LOGIC FROM handleAIGeneration FUNCTION BELOW
    const { user_id, new_user_prompts } = body;
    
    // Validate AI generation request
    const validationResult = GenerateExerciseSchema.safeParse({ user_id, new_user_prompts, exercise_type: 'quiz' });
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.issues.map((e: any) => e.message).join(', '),
        400
      );
    }

    // For now, we'll use the first prompt from new_user_prompts
    const promptText = new_user_prompts[0] || '';
    
    if (!promptText) {
      return createErrorResponse('At least one prompt is required', 400);
    }

    // Generate concept summary using Claude
    const conceptSummary = await generateConceptSummary(promptText);

    // Create new concept (since we're using new_user_prompts, we'll create a new concept each time)
    const { data: newConcept, error: conceptError } = await supabase
      .from('concepts')
      .insert({
        user_id: user_id,
        // OLD CODE - concept_name: conceptSummary.substring(0, 100) + '...', // Truncate for concept name
        concept: { name: conceptSummary.substring(0, 100) + '...' }, // Changed to concept (json)
        source_prompt_id: null, // No source prompt since this is from new_user_prompts
        // OLD CODE - status: 'unlearned'
        skillLevel: 1 // Changed from status: 'unlearned' to skillLevel: 1 (assuming 1 = unlearned)
      })
      .select()
      .single();

    if (conceptError || !newConcept) {
      return createErrorResponse('Failed to create concept', 500);
    }
    const conceptId = newConcept.id;

    // Generate exercise using Claude
    const exercise = await generateExercise(conceptSummary, 'quiz');

    // Insert exercise into database
    const exerciseData: ExerciseInsert = {
      user_id: user_id,
      concept_id: conceptId,
      exercise_type: 'quiz',
      question: exercise.question,
      answer: exercise.answer,
      ai_feedback: {
        generated_from: 'claude',
        concept_summary: conceptSummary,
        new_user_prompts: new_user_prompts
      },
      completed: false,
    };

    const { data, error } = await supabase
      .from('exercises')
      .insert(exerciseData)
      .select(`
        *,
        concepts (
          id,
          concept_name,
          status
        )
      `)
      .single();

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to create exercise', 500);
    }

    return createSuccessResponse(data, 201);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

// OLD FUNCTION - COMMENTED OUT (logic moved to POST function above)
// async function handleAIGeneration(request: NextRequest, body: any) {
// async function handleAIGeneration(request: NextRequest, user_id: string, new_user_prompts: string[]) {
//   try {
//     // Validate AI generation request
//     const validationResult = GenerateExerciseSchema.safeParse(new_user_prompts);
//     
//     if (!validationResult.success) {
//       return createErrorResponse(
//         'Validation error: ' + validationResult.error.issues.map((e: any) => e.message).join(', '),
//         400
//       );
//     }

//     // Fetch the prompt from cursor_prompts
//     const { data: prompt, error: promptError } = await supabase
//       .from('cursor_prompts')
//       .select('*')
//       .eq('id', validationResult.data.prompt_id)
//       .eq('user_id', user_id)
//       .single();

//     if (promptError || !prompt) {
//       return createErrorResponse('Prompt not found or access denied', 404);
//     }

//     // Generate concept summary using Claude
//     const conceptSummary = await generateConceptSummary(prompt.prompt_text);

//     // Create or find concept
//     let conceptId: string;
//     const { data: existingConcept } = await supabase
//       .from('concepts')
//       .select('id')
//       .eq('user_id', userId)
//       .eq('source_prompt_id', prompt.id)
//       .single();

//     if (existingConcept) {
//       conceptId = existingConcept.id;
//     } else {
//       // Create new concept
//       const { data: newConcept, error: conceptError } = await supabase
//         .from('concepts')
//         .insert({
//           user_id: userId,
//           concept_name: conceptSummary.substring(0, 100) + '...', // Truncate for concept name
//           source_prompt_id: prompt.id,
//           status: 'unlearned'
//         })
//         .select()
//         .single();

//       if (conceptError || !newConcept) {
//         return createErrorResponse('Failed to create concept', 500);
//       }
//       conceptId = newConcept.id;
//     }

//     // Generate exercise using Claude
//     const exercise = await generateExercise(conceptSummary, validationResult.data.exercise_type);

//     // Insert exercise into database
//     const exerciseData: ExerciseInsert = {
//       user_id: userId,
//       concept_id: conceptId,
//       exercise_type: validationResult.data.exercise_type,
//       question: exercise.question,
//       answer: exercise.answer,
//       ai_feedback: {
//         generated_from: 'claude',
//         concept_summary: conceptSummary,
//         source_prompt_id: prompt.id
//       },
//       completed: false,
//     };

//     const { data, error } = await supabase
//       .from('exercises')
//       .insert(exerciseData)
//       .select(`
//         *,
//         concepts (
//           id,
//           concept_name,
//           status
//         )
//       `)
//       .single();

//     if (error) {
//       console.error('Database error:', error);
//       return createErrorResponse('Failed to create exercise', 500);
//     }

//     return createSuccessResponse(data, 201);
//   } catch (error) {
//     console.error('AI generation error:', error);
//     return createErrorResponse('Failed to generate exercise with AI', 500);
//   }
// }