# Cursor Prompts Trigger Setup Instructions

## Overview
This setup creates a database trigger that automatically calls your TypeScript Edge Function whenever a new row is inserted into the `cursor_prompts` table.

## What Was Created

### 1. Database Trigger (`002_cursor_prompts_trigger.sql`)
- Creates a PostgreSQL function `notify_cursor_prompts_insert()`
- Creates a trigger `cursor_prompts_insert_trigger` on the `cursor_prompts` table
- The trigger calls your Edge Function via HTTP when a new row is inserted

### 2. Updated Edge Function (`cursor-summary/index.ts`)
- Enhanced to handle trigger payloads properly
- Prints clear, formatted messages to the console when triggered
- Shows prompt details, user info, and recent prompts

## Setup Steps

### 1. Apply the Database Migration
```bash
cd /Users/Loaner/Desktop/HackMIT
supabase db reset
# or if you want to apply just the new migration:
supabase db push
```

### 2. Start Supabase Locally
```bash
supabase start
```

### 3. Deploy the Edge Function
```bash
supabase functions deploy cursor-summary
```

### 4. Test the Setup
You can test in several ways:

#### Option A: Using the SQL test script
```bash
# Connect to your local database
supabase db reset
# Then run the test script
psql -h localhost -p 54322 -U postgres -d postgres -f test_cursor_trigger.sql
```

#### Option B: Using Supabase Studio
1. Go to http://localhost:54323
2. Navigate to the Table Editor
3. Select the `cursor_prompts` table
4. Click "Insert" and add a new row with:
   - `user_id`: `00000000-0000-0000-0000-000000000001`
   - `prompt_text`: `Test prompt: How do I implement authentication?`

#### Option C: Using your application
Insert a row through your application's API or frontend.

## What You Should See

When a new row is inserted, you should see output in your Supabase logs like:

```
🎯 NEW CURSOR PROMPT ADDED!
=====================================
📝 Prompt ID: 12345678-1234-1234-1234-123456789abc
👤 User ID: 00000000-0000-0000-0000-000000000001
📄 Prompt Text: Test prompt: How do I implement authentication?
⏰ Timestamp: 2024-01-15T10:30:00.000Z
=====================================
📊 Total prompts for this user: 1
📋 Recent prompts:
   1. [2024-01-15T10:30:00.000Z] Test prompt: How do I implement authentication?
✅ Cursor prompt processing completed successfully!
```

## Troubleshooting

### If the trigger doesn't fire:
1. Check that the migration was applied: `supabase db diff`
2. Verify the trigger exists: 
   ```sql
   SELECT * FROM pg_trigger WHERE tgname = 'cursor_prompts_insert_trigger';
   ```

### If the Edge Function isn't called:
1. Check that the function is deployed: `supabase functions list`
2. Verify the function URL in the trigger matches your local setup
3. Check the Supabase logs: `supabase functions logs cursor-summary`

### If you see HTTP errors:
1. Make sure Supabase is running: `supabase status`
2. Check that the Edge Function is accessible at the correct URL
3. Verify the service role key is properly configured

## Production Considerations

For production deployment:
1. Update the trigger to use your production Edge Function URL
2. Ensure proper authentication and security
3. Consider error handling and retry logic
4. Monitor function performance and costs

## Cleanup

To remove the trigger:
```sql
DROP TRIGGER IF EXISTS cursor_prompts_insert_trigger ON cursor_prompts;
DROP FUNCTION IF EXISTS notify_cursor_prompts_insert();
```
