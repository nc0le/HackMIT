import { NextRequest } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase';
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

    // fetch all concepts for the user (body.user_id) match column user_id equals body.user_id (all_concepts)
    const { data: all_concepts, error: conceptsError } = await supabaseAdmin
    .from('concepts')
    .select('*')
    .eq('user_id', validationResult.data.user_id);
  
    if (conceptsError) {
      console.error('Error fetching concepts:', conceptsError);
      return createErrorResponse('Failed to fetch user concepts :((( but this should never happen pls', 500);
    }

    // Generate concept summary using Claude
    const generatedConcepts: Concept[] = await generateConceptSummary(body.last_prompts, all_concepts);

    // Process concepts - create new ones if id is null
    const processedConcepts: Concept[] = [];

    for (const concept of generatedConcepts) {
      if (concept.id === null) {
        // Create new concept in database
        const { data: newConcept, error: conceptError } = await supabaseAdmin
          .from('concepts')
          .insert({
            user_id: concept.user_id,
            title: concept.title,
            description: concept.description,
            skillLevel: concept.skillLevel
          })
          .select()
          .single();

        if (conceptError || !newConcept) {
          console.error('Failed to create concept:', conceptError);
          return createErrorResponse('Failed to create concept', 500);
        }

        processedConcepts.push({
          ...concept,
          id: newConcept.id,
          created_at: newConcept.created_at
        });
      } else {
        processedConcepts.push(concept);
      }
    }

    // Use the first concept for exercise generation
    const firstConcept = processedConcepts[0];
    if (!firstConcept) {
      return createErrorResponse('No concepts generated', 500);
    }

    // Generate exercise using Claude
    const exercise = await generateExercise(firstConcept.description, validationResult.data.exercise_type);

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