# Learning App Backend

A comprehensive Next.js + Supabase backend for a learning management application. This backend provides RESTful APIs for managing cursor prompts, learning concepts, and practice exercises with built-in authentication and data validation.

## Features

- ✅ **Database Schema**: PostgreSQL with proper relationships and Row Level Security (RLS)
- ✅ **Authentication**: JWT-based auth with Supabase
- ✅ **API Routes**: RESTful endpoints for all operations
- ✅ **Validation**: Request validation with Zod
- ✅ **TypeScript**: Full type safety with TypeScript interfaces
- ✅ **Error Handling**: Comprehensive error handling with proper HTTP status codes
- ✅ **Security**: Row Level Security policies to protect user data

## Database Schema

### Tables

1. **cursor_prompts**
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `prompt_text` (text)
   - `timestamp` (timestamptz, default now())

2. **concepts**
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `concept_name` (text)
   - `source_prompt_id` (uuid, references cursor_prompts.id)
   - `status` (enum: "unlearned", "learning", "mastered")
   - `created_at` (timestamptz, default now())

3. **exercises**
   - `id` (uuid, primary key)
   - `user_id` (uuid, references auth.users)
   - `concept_id` (uuid, references concepts.id)
   - `exercise_type` (enum: "flashcard", "code", "quiz")
   - `question` (text)
   - `answer` (text)
   - `ai_feedback` (jsonb)
   - `completed` (boolean, default false)
   - `created_at` (timestamptz, default now())

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/prompts` | Log new prompt |
| GET | `/api/prompts` | Get user's prompts (with pagination) |
| GET | `/api/concepts/:user_id` | Fetch user's concepts |
| POST | `/api/concepts` | Add a new concept |
| GET | `/api/exercises/user/:user_id` | Fetch user's exercises |
| POST | `/api/exercises` | Create new exercise |
| PATCH | `/api/exercises/:id` | Mark exercise as completed + store AI feedback |
| GET | `/api/exercises/:id` | Get specific exercise |

## Quick Start

### 1. Prerequisites

- Node.js 18+ and npm
- Supabase account and project

### 2. Installation

```bash
# Clone or navigate to the backend directory
cd backend

# Install dependencies
npm install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 4. Database Setup

1. Go to your Supabase project dashboard
2. Navigate to the SQL Editor
3. Run the migration script from `supabase/migrations/001_initial_schema.sql`

### 5. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```

The API will be available at `http://localhost:3000`

### 6. Seed Test Data (Optional)

To populate your database with sample data:

1. Update the `testUserId` in `scripts/seed.js` with a real user ID from your Supabase Auth
2. Run the seed script:

```bash
npm run seed
```

## Authentication

All API endpoints require authentication via JWT token in the Authorization header:

```
Authorization: Bearer <your-jwt-token>
```

To get a JWT token, authenticate a user through Supabase Auth (sign up/sign in).

## Usage Examples

See [API_EXAMPLES.md](./API_EXAMPLES.md) for detailed usage examples with cURL and JavaScript fetch().

## Project Structure

```
backend/
├── app/
│   ├── api/
│   │   ├── prompts/
│   │   │   └── route.ts
│   │   ├── concepts/
│   │   │   ├── route.ts
│   │   │   └── [user_id]/
│   │   │       └── route.ts
│   │   └── exercises/
│   │       ├── route.ts
│   │       ├── [id]/
│   │       │   └── route.ts
│   │       └── user/
│   │           └── [user_id]/
│   │               └── route.ts
│   ├── layout.tsx
│   └── page.tsx
├── lib/
│   ├── supabase.ts      # Supabase client configuration
│   ├── auth.ts          # Authentication middleware
│   └── validations.ts   # Zod validation schemas
├── types/
│   └── database.ts      # TypeScript interfaces
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql
├── scripts/
│   └── seed.js          # Database seeding script
├── package.json
├── tsconfig.json
├── next.config.js
└── README.md
```

## Development

### Type Checking

```bash
npm run type-check
```

### Adding New Endpoints

1. Create new route files in the appropriate `app/api/` directory
2. Add validation schemas in `lib/validations.ts`
3. Update TypeScript types in `types/database.ts`
4. Test with the provided examples

### Database Changes

1. Create new migration files in `supabase/migrations/`
2. Apply migrations through Supabase dashboard or CLI
3. Update TypeScript interfaces accordingly

## Security Features

- **Row Level Security (RLS)**: Users can only access their own data
- **JWT Authentication**: All endpoints protected by Supabase Auth
- **Input Validation**: All requests validated with Zod schemas
- **SQL Injection Protection**: Using Supabase client with parameterized queries

## Error Handling

The API returns consistent error responses:

```json
{
  "error": "Error message"
}
```

Common HTTP status codes:
- `200`: Success
- `201`: Created
- `400`: Bad Request (validation errors)
- `401`: Unauthorized (missing/invalid token)
- `403`: Forbidden (access denied)
- `404`: Not Found
- `500`: Internal Server Error

## Contributing

1. Follow the existing code structure and naming conventions
2. Add proper TypeScript types for new features
3. Include validation schemas for new endpoints
4. Test your changes thoroughly
5. Update documentation as needed

## License

ISC License
