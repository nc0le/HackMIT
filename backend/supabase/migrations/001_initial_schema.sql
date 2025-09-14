-- Create custom types (enums)
CREATE TYPE concept_status AS ENUM ('unlearned', 'learning', 'mastered');
CREATE TYPE exercise_type AS ENUM ('flashcard', 'code', 'quiz');

-- Create cursor_prompts table
CREATE TABLE cursor_prompts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    cursor_prompt TEXT NOT NULL,
    user_id TEXT NOT NULL
);

-- Create concepts table
CREATE TABLE concepts (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    concept_name TEXT NOT NULL,
    source_prompt_id BIGINT REFERENCES cursor_prompts(id) ON DELETE SET NULL,
    status concept_status DEFAULT 'unlearned',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create exercises table
CREATE TABLE exercises (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    concept_id UUID REFERENCES concepts(id) ON DELETE CASCADE,
    exercise_type exercise_type NOT NULL,
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    ai_feedback JSONB,
    completed BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_cursor_prompts_user_id ON cursor_prompts(user_id);
CREATE INDEX idx_cursor_prompts_created_at ON cursor_prompts(created_at);

CREATE INDEX idx_concepts_user_id ON concepts(user_id);
CREATE INDEX idx_concepts_status ON concepts(status);
CREATE INDEX idx_concepts_created_at ON concepts(created_at);

CREATE INDEX idx_exercises_user_id ON exercises(user_id);
CREATE INDEX idx_exercises_concept_id ON exercises(concept_id);
CREATE INDEX idx_exercises_completed ON exercises(completed);
CREATE INDEX idx_exercises_created_at ON exercises(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE cursor_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE concepts ENABLE ROW LEVEL SECURITY;
ALTER TABLE exercises ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data

-- cursor_prompts policies
CREATE POLICY "Users can view own prompts" ON cursor_prompts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own prompts" ON cursor_prompts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- concepts policies
CREATE POLICY "Users can view own concepts" ON concepts
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own concepts" ON concepts
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own concepts" ON concepts
    FOR UPDATE USING (auth.uid() = user_id);

-- exercises policies
CREATE POLICY "Users can view own exercises" ON exercises
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own exercises" ON exercises
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own exercises" ON exercises
    FOR UPDATE USING (auth.uid() = user_id);
