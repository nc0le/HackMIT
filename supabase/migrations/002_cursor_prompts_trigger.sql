-- Create a function that will be called by the trigger
CREATE OR REPLACE FUNCTION notify_cursor_prompts_insert()
RETURNS TRIGGER AS $$
BEGIN
  -- Call the Edge Function via HTTP
  PERFORM
    net.http_post(
      url := 'http://127.0.0.1:54321/functions/v1/cursor-summary',
      headers := '{"Content-Type": "application/json", "Authorization": "Bearer ' || current_setting('app.settings.service_role_key', true) || '"}'::jsonb,
      body := json_build_object(
        'record', row_to_json(NEW)
      )::text
    );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create the trigger that fires on INSERT
CREATE TRIGGER cursor_prompts_insert_trigger
  AFTER INSERT ON cursor_prompts
  FOR EACH ROW
  EXECUTE FUNCTION notify_cursor_prompts_insert();

-- Enable the http extension if not already enabled
CREATE EXTENSION IF NOT EXISTS http;
