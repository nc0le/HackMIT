import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { CreateExerciseSchema, GenerateExerciseSchema } from '@/lib/validations';
import { ExerciseInsert } from '@/types/database';
import { generateConceptSummary, generateExercise } from '@/lib/claude';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Parse and validate request body
    const body = await request.json();
    
    // Check if this is an AI generation request
    if (body.generate_from_prompt) {
      return await handleAIGeneration(request, userId, body);
    }
    
    // Handle regular exercise creation
    const validationResult = CreateExerciseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.issues.map((e: any) => e.message).join(', '),
        400
      );
    }

    // Verify concept exists and belongs to user
    const { data: concept, error: conceptError } = await supabase
      .from('concepts')
      .select('id')
      .eq('id', validationResult.data.concept_id)
      .eq('user_id', userId)
      .single();

    if (conceptError || !concept) {
      return createErrorResponse('Concept not found or access denied', 404);
    }

    // Insert exercise into database
    const exerciseData: ExerciseInsert = {
      user_id: userId,
      concept_id: validationResult.data.concept_id,
      exercise_type: validationResult.data.exercise_type,
      question: validationResult.data.question,
      answer: validationResult.data.answer,
      ai_feedback: validationResult.data.ai_feedback,
      completed: validationResult.data.completed || false,
    };

    const { data, error } = await supabase
      .from('exercises')
      .insert(exerciseData)
      .select()
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

async function handleAIGeneration(request: NextRequest, userId: string, body: any) {
  try {
    // Validate AI generation request
    const validationResult = GenerateExerciseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.issues.map((e: any) => e.message).join(', '),
        400
      );
    }

    // Fetch the prompt from cursor_prompts
    const { data: prompt, error: promptError } = await supabase
      .from('cursor_prompts')
      .select('*')
      .eq('id', validationResult.data.prompt_id)
      .eq('user_id', userId)
      .single();

    if (promptError || !prompt) {
      return createErrorResponse('Prompt not found or access denied', 404);
    }

    // Generate concept summary using Claude
    const conceptSummary = await generateConceptSummary(prompt.prompt_text);

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
    console.error('AI generation error:', error);
    return createErrorResponse('Failed to generate exercise with AI', 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Get query parameters
    const url = new URL(request.url);
    const conceptId = url.searchParams.get('concept_id');
    const exerciseType = url.searchParams.get('exercise_type');
    const completed = url.searchParams.get('completed');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const offset = parseInt(url.searchParams.get('offset') || '0');

    // Build query with joins to get concept information
    let query = supabase
      .from('exercises')
      .select(`
        *,
        concepts (
          id,
          concept_name,
          status
        )
      `)
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    // Add filters if provided
    if (conceptId) {
      query = query.eq('concept_id', conceptId);
    }

    if (exerciseType && ['flashcard', 'code', 'quiz'].includes(exerciseType)) {
      query = query.eq('exercise_type', exerciseType);
    }

    if (completed !== null && ['true', 'false'].includes(completed || '')) {
      query = query.eq('completed', completed === 'true');
    }

    // Apply pagination
    query = query.range(offset, offset + limit - 1);

    const { data, error } = await query;

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to fetch exercises', 500);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
