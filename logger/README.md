# Terminal Input Logger

A Python-based terminal logger that captures and uploads user commands to a Supabase database. The system uses PTY (pseudo-terminal) to wrap terminal sessions and intelligently detects user input vs pasted content.

## Setup

1. Install dependencies: `pip install -r requirements.txt`
2. Configure environment variables in `.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
3. Run: `python logger.py -u username -- claude`

## How It Works

1. Logger creates a PTY session wrapping the target command
2. All user keystrokes are intercepted and analyzed for timing patterns
3. On Enter keypress (non-pasted), the accumulated command line is cleaned and uploaded
4. Terminal continues to function normally while logging runs in background
