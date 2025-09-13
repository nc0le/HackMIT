-- Test script to insert a row into cursor_prompts and trigger the Edge Function
-- This will help you verify that the trigger is working correctly

-- First, let's create a test user (you might need to adjust this based on your auth setup)
-- For testing purposes, we'll use a dummy UUID
INSERT INTO cursor_prompts (user_id, prompt_text) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, 
  'Test prompt: How do I implement authentication in my React app?'
);

-- You can also insert multiple test prompts
INSERT INTO cursor_prompts (user_id, prompt_text) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::uuid, 
  'Test prompt: What are the best practices for database design?'
);

-- Check that the rows were inserted
SELECT * FROM cursor_prompts ORDER BY timestamp DESC LIMIT 5;
