"""
PTY wrapper that logs user input as a single request on Enter.
Detects multi-line pastes and sends only one POST.
Uses timing to distinguish pasted vs typed text (optional).
Requires the `requests` library.

Run with python logger.py -- claude
"""

import os
import pty
import sys
import tty
import select
import time
import argparse
import signal

from functions import upload_to_database, prompt_to_update
from utilities import clean_terminal_input, is_physical_enter

# Threshold in seconds to detect pasted input (fast consecutive bytes)
PASTE_THRESHOLD = 0.005  # 5 ms
PROMPTS_THRESHOLD = 10

def cleanup_and_exit(last_prompts):
    """Send remaining prompts before exit"""
    if last_prompts:
        print("\nSending remaining prompts before exit...")
        try:
            prompt_to_update(last_prompts)
        except Exception as e:
            print(f"Error sending final prompts: {e}")
    sys.exit(0)

def run_and_log(cmd_args, url=None):
    pid, master_fd = pty.fork()
    if pid == 0:
        # Child process: run target program
        os.execvp(cmd_args[0], cmd_args)
    else:
        stdin_fd = sys.stdin.fileno()
        stdout_fd = sys.stdout.fileno()

        # Set terminal to raw mode
        old_attrs = None
        try:
            old_attrs = tty.tcgetattr(stdin_fd)
            tty.setraw(stdin_fd)
        except Exception:
            old_attrs = None

        line_buffer = []
        last_prompts = [] # keep track of prompts before updating
        last_byte_time = None

        # Set up signal handlers for graceful exit
        def signal_handler(signum, frame):
            cleanup_and_exit(last_prompts)

        signal.signal(signal.SIGINT, signal_handler)  # Ctrl+C
        signal.signal(signal.SIGTERM, signal_handler)  # Termination signal

        try:
            while True:
                rlist, _, _ = select.select([stdin_fd, master_fd], [], [])

                # --- User input ---
                if stdin_fd in rlist:
                    data = os.read(stdin_fd, 1024)
                    if not data:
                        os.close(master_fd)
                        break

                    # Forward all keystrokes to child program
                    os.write(master_fd, data)

                    now = time.time()
                    for b in data:
                        dt = (now - last_byte_time) if last_byte_time else None
                        last_byte_time = now

                        is_paste = dt is not None and dt < PASTE_THRESHOLD

                        if is_physical_enter(b) and not is_paste:
                            # Only trigger POST on actual Enter keypress (not paste)
                            if line_buffer:
                                command_line: str = clean_terminal_input("".join(line_buffer))
                                upload_to_database(command_line)
                                last_prompts.append(command_line)
                                
                                if len(last_prompts) >= PROMPTS_THRESHOLD:
                                    prompt_to_update(last_prompts)
                                    last_prompts = []
                            line_buffer = []
                        elif b in (8, 127):  # backspace/delete
                            if line_buffer:
                                line_buffer.pop()
                        else:
                            # Append all other characters (including pasted newlines)
                            try:
                                ch = bytes([b]).decode("utf-8", errors="replace")
                            except Exception:
                                ch = "?"
                            line_buffer.append(ch)

                # --- Child output ---
                if master_fd in rlist:
                    out = os.read(master_fd, 1024)
                    if not out:
                        break
                    os.write(stdout_fd, out)

        finally:
            if last_prompts:
                print("\nSending remaining prompts before exit...")
                try:
                    prompt_to_update(last_prompts)
                except Exception as e:
                    print(f"Error sending final prompts: {e}")

            if old_attrs:
                tty.tcsetattr(stdin_fd, tty.TCSADRAIN, old_attrs)
            try:
                os.waitpid(pid, 0)
            except Exception:
                pass


def main():
    parser = argparse.ArgumentParser(description="PTY logger with paste detection")
    parser.add_argument("cmd", nargs=argparse.REMAINDER, help="-- then command and args to run")
    args = parser.parse_args()

    if not args.cmd:
        print("Error: no command supplied. Use -- /path/to/program args...", file=sys.stderr)
        sys.exit(2)

    cmd_args = args.cmd[1:] if args.cmd[0] == '--' else args.cmd
    run_and_log(cmd_args)


if __name__ == "__main__":
    main()
