# AI Exercise Generation API

## New Endpoint: POST /api/exercises

### AI-Generated Exercise Creation

To create an exercise using AI from a cursor prompt, send a POST request with the `generate_from_prompt` flag:

#### Request Body:
```json
{
  "generate_from_prompt": true,
  "prompt_id": "123e4567-e89b-12d3-a456-426614174000",
  "exercise_type": "flashcard"
}
```

#### Supported Exercise Types:
- `flashcard` - Question and answer format
- `code` - Coding exercise with implementation
- `quiz` - Multiple choice question

#### Example cURL:
```bash
curl -X POST http://localhost:3000/api/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "generate_from_prompt": true,
    "prompt_id": "123e4567-e89b-12d3-a456-426614174000",
    "exercise_type": "flashcard"
  }'
```

#### Example JavaScript:
```javascript
const response = await fetch('/api/exercises', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    generate_from_prompt: true,
    prompt_id: '123e4567-e89b-12d3-a456-426614174000',
    exercise_type: 'flashcard'
  })
});

const result = await response.json();
console.log(result);
```

## How It Works:

1. **Fetches Prompt**: Retrieves the cursor prompt from `cursor_prompts` table
2. **Generates Summary**: Calls Claude API to create a concept summary
3. **Creates/Finds Concept**: Creates a new concept or uses existing one linked to the prompt
4. **Generates Exercise**: Calls Claude API again to create the exercise
5. **Saves Exercise**: Stores the exercise in the database with AI metadata

## Response Format:

```json
{
  "data": {
    "id": "exercise-uuid",
    "user_id": "user-uuid",
    "concept_id": "concept-uuid",
    "exercise_type": "flashcard",
    "question": "What is the purpose of React hooks?",
    "answer": "React hooks allow functional components to manage state and lifecycle methods...",
    "ai_feedback": {
      "generated_from": "claude",
      "concept_summary": "React hooks are functions that let you use state...",
      "source_prompt_id": "prompt-uuid"
    },
    "completed": false,
    "created_at": "2024-01-01T00:00:00Z",
    "concepts": {
      "id": "concept-uuid",
      "concept_name": "React Hooks Summary...",
      "status": "unlearned"
    }
  }
}
```

## Environment Setup:

Add to your `.env.local` file:
```
ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

## Error Handling:

- **401**: Unauthorized (invalid/missing JWT token)
- **400**: Validation error (invalid prompt_id or exercise_type)
- **404**: Prompt not found or access denied
- **500**: AI generation failed or database error

## Notes:

- The AI will create a concept summary from the prompt text
- If a concept already exists for the prompt, it will reuse it
- The exercise is generated based on the concept summary and exercise type
- All AI-generated content is stored with metadata for tracking
