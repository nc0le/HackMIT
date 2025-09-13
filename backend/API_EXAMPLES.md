# API Usage Examples

## Prerequisites
1. Set up your Supabase project and get the URL and API keys
2. Create a `.env.local` file with your Supabase credentials:
```
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```
3. Run the migration: Apply the SQL from `supabase/migrations/001_initial_schema.sql` to your Supabase database
4. Get a valid JWT token by authenticating a user through Supabase Auth

## Authentication
All API calls require a valid JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

## API Endpoints Examples

### 1. POST /api/prompts - Log new prompt

#### cURL:
```bash
curl -X POST http://localhost:3000/api/prompts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "prompt_text": "Explain how React hooks work and when to use useState vs useEffect"
  }'
```

#### JavaScript fetch():
```javascript
const response = await fetch('/api/prompts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    prompt_text: 'Explain how React hooks work and when to use useState vs useEffect'
  })
});

const result = await response.json();
console.log(result);
```

### 2. GET /api/prompts - Get user's prompts

#### cURL:
```bash
curl -X GET "http://localhost:3000/api/prompts?limit=10&offset=0" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### JavaScript fetch():
```javascript
const response = await fetch('/api/prompts?limit=10&offset=0', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result);
```

### 3. POST /api/concepts - Add a new concept

#### cURL:
```bash
curl -X POST http://localhost:3000/api/concepts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "concept_name": "React Hooks",
    "source_prompt_id": "123e4567-e89b-12d3-a456-426614174000",
    "status": "learning"
  }'
```

#### JavaScript fetch():
```javascript
const response = await fetch('/api/concepts', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    concept_name: 'React Hooks',
    source_prompt_id: '123e4567-e89b-12d3-a456-426614174000',
    status: 'learning'
  })
});

const result = await response.json();
console.log(result);
```

### 4. GET /api/concepts/[user_id] - Fetch user's concepts

#### cURL:
```bash
curl -X GET "http://localhost:3000/api/concepts/123e4567-e89b-12d3-a456-426614174001?status=learning&limit=20" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### JavaScript fetch():
```javascript
const userId = '123e4567-e89b-12d3-a456-426614174001';
const response = await fetch(`/api/concepts/${userId}?status=learning&limit=20`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result);
```

### 5. POST /api/exercises - Create new exercise

#### cURL:
```bash
curl -X POST http://localhost:3000/api/exercises \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "concept_id": "123e4567-e89b-12d3-a456-426614174002",
    "exercise_type": "flashcard",
    "question": "What is the purpose of the useState hook in React?",
    "answer": "useState is a React hook that allows functional components to manage local state."
  }'
```

#### JavaScript fetch():
```javascript
const response = await fetch('/api/exercises', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    concept_id: '123e4567-e89b-12d3-a456-426614174002',
    exercise_type: 'flashcard',
    question: 'What is the purpose of the useState hook in React?',
    answer: 'useState is a React hook that allows functional components to manage local state.'
  })
});

const result = await response.json();
console.log(result);
```

### 6. GET /api/exercises/user/[user_id] - Fetch user's exercises

#### cURL:
```bash
curl -X GET "http://localhost:3000/api/exercises/user/123e4567-e89b-12d3-a456-426614174001?exercise_type=flashcard&completed=false" \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### JavaScript fetch():
```javascript
const userId = '123e4567-e89b-12d3-a456-426614174001';
const response = await fetch(`/api/exercises/user/${userId}?exercise_type=flashcard&completed=false`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result);
```

### 7. PATCH /api/exercises/[id] - Mark exercise as completed + store AI feedback

#### cURL:
```bash
curl -X PATCH http://localhost:3000/api/exercises/123e4567-e89b-12d3-a456-426614174003 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <your-jwt-token>" \
  -d '{
    "completed": true,
    "ai_feedback": {
      "score": 85,
      "feedback": "Good understanding of useState basics. Try to include examples in your explanation.",
      "areas_to_improve": ["Examples", "Advanced usage"]
    }
  }'
```

#### JavaScript fetch():
```javascript
const exerciseId = '123e4567-e89b-12d3-a456-426614174003';
const response = await fetch(`/api/exercises/${exerciseId}`, {
  method: 'PATCH',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    completed: true,
    ai_feedback: {
      score: 85,
      feedback: 'Good understanding of useState basics. Try to include examples in your explanation.',
      areas_to_improve: ['Examples', 'Advanced usage']
    }
  })
});

const result = await response.json();
console.log(result);
```

### 8. GET /api/exercises/[id] - Get specific exercise

#### cURL:
```bash
curl -X GET http://localhost:3000/api/exercises/123e4567-e89b-12d3-a456-426614174003 \
  -H "Authorization: Bearer <your-jwt-token>"
```

#### JavaScript fetch():
```javascript
const exerciseId = '123e4567-e89b-12d3-a456-426614174003';
const response = await fetch(`/api/exercises/${exerciseId}`, {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});

const result = await response.json();
console.log(result);
```

## Response Format

All API responses follow this format:

### Success Response:
```json
{
  "data": {
    // ... response data
  }
}
```

### Error Response:
```json
{
  "error": "Error message"
}
```

## Query Parameters

### Pagination (available on GET endpoints):
- `limit`: Number of records to return (default: 50)
- `offset`: Number of records to skip (default: 0)

### Filtering:
- **Concepts**: `status` (unlearned, learning, mastered)
- **Exercises**: `concept_id`, `exercise_type` (flashcard, code, quiz), `completed` (true, false)

## Running the Seed Script

To populate your database with sample data for testing:

1. Make sure your `.env.local` file is set up with valid Supabase credentials
2. Update the `testUserId` in `scripts/seed.js` with a real user ID from your Supabase Auth users
3. Run the seed script:

```bash
npm run seed
```

This will create sample prompts, concepts, and exercises for testing the API.
