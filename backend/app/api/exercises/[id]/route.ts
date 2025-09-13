import { NextRequest } from 'next/server';
import { supabase } from '@/lib/supabase';
import { verifyAuth, createErrorResponse, createSuccessResponse } from '@/lib/auth';
import { UpdateExerciseSchema, UuidSchema } from '@/lib/validations';

interface RouteParams {
  params: {
    id: string;
  };
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Validate exercise ID
    const idValidation = UuidSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid exercise ID format', 400);
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = UpdateExerciseSchema.safeParse(body);
    
    if (!validationResult.success) {
      return createErrorResponse(
        'Validation error: ' + validationResult.error.errors.map(e => e.message).join(', '),
        400
      );
    }

    // Verify exercise exists and belongs to user
    const { data: existingExercise, error: fetchError } = await supabase
      .from('exercises')
      .select('id, user_id')
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (fetchError || !existingExercise) {
      return createErrorResponse('Exercise not found or access denied', 404);
    }

    // Update exercise
    const { data, error } = await supabase
      .from('exercises')
      .update(validationResult.data)
      .eq('id', params.id)
      .eq('user_id', userId)
      .select()
      .single();

    if (error) {
      console.error('Database error:', error);
      return createErrorResponse('Failed to update exercise', 500);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    // Verify authentication
    const userId = await verifyAuth(request);
    if (!userId) {
      return createErrorResponse('Unauthorized', 401);
    }

    // Validate exercise ID
    const idValidation = UuidSchema.safeParse(params.id);
    if (!idValidation.success) {
      return createErrorResponse('Invalid exercise ID format', 400);
    }

    // Fetch exercise with concept information
    const { data, error } = await supabase
      .from('exercises')
      .select(`
        *,
        concepts (
          id,
          concept_name,
          status
        )
      `)
      .eq('id', params.id)
      .eq('user_id', userId)
      .single();

    if (error || !data) {
      return createErrorResponse('Exercise not found or access denied', 404);
    }

    return createSuccessResponse(data);
  } catch (error) {
    console.error('API error:', error);
    return createErrorResponse('Internal server error', 500);
  }
}
