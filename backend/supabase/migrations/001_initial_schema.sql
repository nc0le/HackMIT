
-- Create cursor_prompts table
CREATE TABLE cursor_prompts (
    id BIGSERIAL PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    cursor_prompt TEXT NOT NULL,
    user_id TEXT NOT NULL
);

-- Create concepts table
CREATE TABLE concepts (
    id BIGSERIAL PRIMARY KEY,
    concept JSON NOT NULL,
    source_prompt_id BIGINT REFERENCES cursor_prompts(id) ON DELETE SET NULL,
    skillLevel BIGINT NOT NULL
    user_id TEXT NOT NULL
);

-- Create coding_exercises table
CREATE TABLE coding_exercises (
    id BIGSERIAL PRIMARY KEY,
    concept JSON NOT NULL,
    description JSON NOT NULL,
    code TEXT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    user_id TEXT NOT NULL
);

-- Create indexes for better query performance
CREATE INDEX idx_cursor_prompts_user_id ON cursor_prompts(user_id);
CREATE INDEX idx_cursor_prompts_created_at ON cursor_prompts(created_at);

CREATE INDEX idx_concepts_source_prompt_id ON concepts(source_prompt_id);
CREATE INDEX idx_concepts_skill_level ON concepts(skillLevel);

CREATE INDEX idx_coding_exercises_user_id ON coding_exercises(user_id);
CREATE INDEX idx_coding_exercises_completed ON coding_exercises(completed);

-- Enable Row Level Security (RLS)
ALTER TABLE cursor_prompts ENABLE ROW LEVEL SECURITY;
ALTER TABLE coding_exercises ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only access their own data

-- cursor_prompts policies
CREATE POLICY "Users can view own prompts" ON cursor_prompts
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own prompts" ON cursor_prompts
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- coding_exercises policies
CREATE POLICY "Users can view own coding exercises" ON coding_exercises
    FOR SELECT USING (auth.uid()::text = user_id);

CREATE POLICY "Users can insert own coding exercises" ON coding_exercises
    FOR INSERT WITH CHECK (auth.uid()::text = user_id);

CREATE POLICY "Users can update own coding exercises" ON coding_exercises
    FOR UPDATE USING (auth.uid()::text = user_id);

