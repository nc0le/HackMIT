import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { CreateExerciseSchema, GenerateExerciseSchema } from '@/lib/validations';
import { ExerciseInsert } from '@/types/database';
import { generateConceptSummary, generateExercise } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    // Parse and validate request body
    const body = await request.json();
    
    // Validate AI generation request
    const validationResult = GenerateExerciseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.issues.map((e: any) => e.message).join(', '),
        400
      );
    }

    // TODO->DONE: fetch all concepts for the user (body.user_id) match column user_id equals body.user_id (all_concepts)
        const { data: all_concepts, error: conceptsError } = await supabase
        .from('concepts')
        .select('*')
        .eq('user_id', validationResult.data.user_id);
  
      if (conceptsError) {
        console.error('Error fetching concepts:', conceptsError);
        return createErrorResponse('Failed to fetch user concepts :((( but this should never happen pls', 500);
      }
    // OLD: Fetch the prompt from cursor_prompts
    // const { data: prompt, error: promptError } = await supabase
    //   .from('cursor_prompts')
    //   .select('*')
    //   .eq('id', validationResult.data.prompt_id)
    //   .eq('user_id', userId)
    //   .single();

    // Generate concept summary using Claude
    // TODO: all_concepts is an array of concepts from previous TODO
    const newConcepts = await generateConceptSummary(body.last_prompts, all_concepts, body.user_id);

    // Create or find concept
    let conceptId: string;
    const { data: existingConcept } = await supabase
      .from('concepts')
      .select('id')
      .eq('user_id', userId)
      .eq('source_prompt_id', prompt.id)
      .single();

    if (existingConcept) {
      conceptId = existingConcept.id;
    } else {
      // Create new concept
      const { data: newConcept, error: conceptError } = await supabase
        .from('concepts')
        .insert({
          user_id: userId,
          concept_name: conceptSummary.substring(0, 100) + '...', // Truncate for concept name
          source_prompt_id: prompt.id,
          status: 'unlearned'
        })
        .select()
        .single();

      if (conceptError || !newConcept) {
        return createErrorResponse('Failed to create concept', 500);
      }
      conceptId = newConcept.id;
    }

    // Generate exercise using Claude
    const exercise = await generateExercise(conceptSummary, validationResult.data.exercise_type);

    // Insert exercise into database
    const exerciseData: ExerciseInsert = {
      user_id: userId,
      concept_id: conceptId,
      exercise_type: validationResult.data.exercise_type,
      question: exercise.question,
      answer: exercise.answer,
      ai_feedback: {
        generated_from: 'claude',
        concept_summary: conceptSummary,
        source_prompt_id: prompt.id
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