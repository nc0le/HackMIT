import { NextRequest } from 'next/server';
import { supabase } from './supabase';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

export async function verifyAuth(request: NextRequest): Promise<string | null> {
  try {
    const authHeader = request.headers.get('authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.split(' ')[1];
    
    const { data: { user }, error } = await supabase.auth.getUser(token);
    
    if (error || !user) {
      return null;
    }

    return user.id;
  } catch (error) {
    console.error('Auth verification error:', error);
    return null;
  }
}

export function createErrorResponse(message: string, status: number = 400) {
  return Response.json(
    { error: message },
    { status }
  );
}

export function createSuccessResponse(data: any, status: number = 200) {
  return Response.json(
    { data },
    { status }
  );
}
