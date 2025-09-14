# AI Generation Test Scripts

## Quick Start

### 1. Test AI Functions Directly (No Server Required)
```bash
node test-ai-direct.js
```
This tests the Claude AI functions directly without needing the Next.js server running.

### 2. Test Full API (Server Required)
```bash
# Start the server first
npm run dev

# In another terminal, run the test
node test-ai-simple.js
```

### 3. Run All Tests
```bash
node run-ai-tests.js
```

## Setup Requirements

### Environment Variables
Make sure your `.env` file contains:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
ANTHROPIC_API_KEY=your_anthropic_api_key
```

### User ID Setup
Before running API tests, update the `testUserId` in the test files with a real user ID from your Supabase Auth users table.

## Test Files Explained

### `test-ai-direct.js`
- Tests Claude AI functions directly
- No server required
- Good for testing API key and basic AI functionality

### `test-ai-simple.js`
- Tests the API endpoint with a single exercise generation
- Requires server running
- Creates a test prompt and generates one flashcard exercise

### `test-ai-generation.js`
- Comprehensive test with multiple exercise types
- Tests flashcard, code, and quiz generation
- Requires server running
- Verifies database storage

### `run-ai-tests.js`
- Test runner that executes all tests
- Provides setup instructions
- Shows results from all test types

## Expected Output

### Successful AI Test:
```
🤖 Testing Claude AI Functions Directly...

📝 Testing concept summary generation...
✅ Summary generated:
React hooks are functions that let you use state and other React features in functional components...

🎯 Testing exercise generation...
✅ Exercise generated:
   Question: What is the primary purpose of the useState hook in React?
   Answer: The useState hook allows functional components to manage local state...

🎉 AI functions test completed successfully!
```

### Successful API Test:
```
🤖 Testing AI Exercise Generation...

📝 Creating test prompt...
✅ Prompt created: 123e4567-e89b-12d3-a456-426614174000

🎯 Generating flashcard exercise...
✅ Exercise generated successfully!
📋 Results:
   Question: What is the primary purpose of the useState hook in React?
   Answer: The useState hook allows functional components to manage local state...
   Concept: React Hooks Summary...
```

## Troubleshooting

### Common Issues:

1. **Missing API Key**: Make sure `ANTHROPIC_API_KEY` is set in your `.env` file
2. **Invalid User ID**: Update `testUserId` with a real user ID from your Supabase Auth
3. **Server Not Running**: For API tests, make sure to run `npm run dev` first
4. **Database Permissions**: Ensure your Supabase RLS policies allow the operations

### Error Messages:
- `Missing ANTHROPIC_API_KEY`: Add your Claude API key to `.env`
- `Prompt not found`: Check that the user ID exists in your Supabase Auth
- `Network error`: Make sure the server is running on port 3000
- `Invalid JSON response`: Claude API might be rate-limited or having issues

## Next Steps

After successful testing:
1. Integrate the AI generation into your frontend
2. Add error handling for production use
3. Implement rate limiting for API calls
4. Add user feedback and progress tracking
