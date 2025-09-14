-- Create cursor_summaries table to track when the Edge Function is called
CREATE TABLE cursor_summaries (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    triggered_by_prompt_id TEXT, -- Store as text to avoid type conflicts
    triggered_by_user_id TEXT,   -- Store as text to avoid type conflicts
    function_called_at TIMESTAMPTZ DEFAULT NOW(),
    status TEXT DEFAULT 'completed',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX idx_cursor_summaries_triggered_by_prompt_id ON cursor_summaries(triggered_by_prompt_id);
CREATE INDEX idx_cursor_summaries_triggered_by_user_id ON cursor_summaries(triggered_by_user_id);
CREATE INDEX idx_cursor_summaries_function_called_at ON cursor_summaries(function_called_at);
CREATE INDEX idx_cursor_summaries_status ON cursor_summaries(status);

-- Enable Row Level Security (RLS)
ALTER TABLE cursor_summaries ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can view summaries related to their prompts
CREATE POLICY "Users can view own summaries" ON cursor_summaries
    FOR SELECT USING (auth.uid() = triggered_by_user_id);

-- Service role can insert summaries (for the Edge Function)
CREATE POLICY "Service role can insert summaries" ON cursor_summaries
    FOR INSERT WITH CHECK (true);
