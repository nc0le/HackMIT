# Learning App Backend + Frontend

The backend + frontend for Vibelabs, running on NextJS and powered by Supabase.

## Features

### Backend
- Endpoint for receiving input from the logger
- Generates new exercises and concepts based on user prompt usage
- Verifies user's submissions to exercises

### Frontend
- Interactive lessons with full code editor
- Summary statistics

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

### 4. Run the Application

```bash
# Development mode
npm run dev

# Production build
npm run build
npm start
```
