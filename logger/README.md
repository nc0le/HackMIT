# Terminal Input Logger

A Python-based terminal logger that captures and uploads user commands to a Supabase database. The system uses PTY (pseudo-terminal) to wrap terminal sessions and intelligently detects user input vs pasted content.

## Files Overview

### `logger.py`
Main entry point that creates a PTY wrapper around any terminal command. Features:
- **PTY Wrapper**: Uses `pty.fork()` to create a pseudo-terminal that intercepts user input
- **Paste Detection**: Distinguishes between typed and pasted input using timing thresholds (5ms)
- **Command Logging**: Logs complete command lines to database on Enter keypress
- **Terminal Passthrough**: Forwards all input/output to maintain normal terminal functionality

**Usage**: `python logger.py -- claude` (or any other command)

### `functions.py`
Database interface module that handles Supabase integration:
- **Database Upload**: `upload_to_database()` function inserts commands into `cursor_prompts` table
- **Supabase Client**: Configured using environment variables (`SUPABASE_URL`, `SUPABASE_KEY`)
- **User Management**: Currently uses hardcoded `USER_ID="temp"`

### `utilities.py`
Helper functions for terminal input processing:
- **ANSI Cleaning**: `clean_terminal_input()` removes ANSI escape codes and bracketed paste markers
- **Enter Detection**: `is_physical_enter()` identifies Enter keypress bytes (LF/CR)

### `requirements.txt`
Python dependencies including:
- `supabase==2.18.1` - Database client
- `python-dotenv==1.1.1` - Environment variable loading
- `requests==2.32.5` - HTTP requests
- Additional dependencies for Supabase SDK functionality

## Setup

1. Install dependencies: `pip install -r requirements.txt`
2. Configure environment variables in `.env`:
   ```
   SUPABASE_URL=your_supabase_url
   SUPABASE_KEY=your_supabase_key
   ```
3. Run: `python logger.py -- <your_command>`

## How It Works

1. Logger creates a PTY session wrapping the target command
2. All user keystrokes are intercepted and analyzed for timing patterns
3. On Enter keypress (non-pasted), the accumulated command line is cleaned and uploaded
4. Terminal continues to function normally while logging runs in background