export type ConceptStatus = 'unlearned' | 'learning' | 'mastered';
export type ExerciseType = 'flashcard' | 'code' | 'quiz';

export interface CursorPrompt {
  id: string;
  user_id: string;
  prompt_text: string;
  timestamp: string;
}

export interface Concept {
  id: string | None;
  created_at: string | None;
  user_id: string;
  title: string;
  description: string;
  skillLevel: int;
}

export interface Exercise {
  id: string;
  user_id: string;
  concept_id: string;
  exercise_type: ExerciseType;
  question: string;
  answer: string;
  ai_feedback: Record<string, any> | null;
  completed: boolean;
  created_at: string;
}

// Database insert types (without auto-generated fields)
export interface CursorPromptInsert {
  user_id: string;
  prompt_text: string;
}

export interface ConceptInsert {
  user_id: string;
  concept_name: string;
  source_prompt_id?: string;
  status?: ConceptStatus;
}

export interface ExerciseInsert {
  user_id: string;
  title: string;
  description: string;
  concepts: [string];
  code: string;
  completed?: boolean;
}

// Update types
export interface ExerciseUpdate {
  ai_feedback?: Record<string, any>;
  completed?: boolean;
}

export interface ConceptUpdate {
  concept_name?: string;
  status?: ConceptStatus;
}

// Exercise Types
export interface Code {
  title: string,
  description: string,
  boilerplate_code: string,
}
