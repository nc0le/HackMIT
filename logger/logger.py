"""
PTY wrapper that logs user input as a single request on Enter.
Detects multi-line pastes and sends only one POST.
Uses timing to distinguish pasted vs typed text (optional).
Requires the `requests` library.
"""

import os
import pty
import sys
import tty
import select
import time
import threading
import argparse
import requests

from utilities import clean_terminal_input, is_physical_enter

# Threshold in seconds to detect pasted input (fast consecutive bytes)
PASTE_THRESHOLD = 0.005  # 5 ms

def post_line(url, payload):
    """Send payload to server asynchronously."""
    def _post():
        try:
            requests.post(url, json=payload, timeout=2)
        except Exception:
            pass

    threading.Thread(target=_post, daemon=True).start()


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
        last_byte_time = None

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
                            if line_buffer and url:
                                payload = {
                                    "timestamp": time.strftime("%Y-%m-%d %H:%M:%S"),
                                    "command_line": clean_terminal_input("".join(line_buffer)),
                                    "program": cmd_args[0]
                                }
                                post_line(url, payload)
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
            if old_attrs:
                tty.tcsetattr(stdin_fd, tty.TCSADRAIN, old_attrs)
            try:
                os.waitpid(pid, 0)
            except Exception:
                pass


def main():
    parser = argparse.ArgumentParser(description="PTY logger with paste detection")
    parser.add_argument("--url", required=True, help="Server URL to POST lines to")
    parser.add_argument("cmd", nargs=argparse.REMAINDER, help="-- then command and args to run")
    args = parser.parse_args()

    if not args.cmd:
        print("Error: no command supplied. Use -- /path/to/program args...", file=sys.stderr)
        sys.exit(2)

    cmd_args = args.cmd[1:] if args.cmd[0] == '--' else args.cmd
    run_and_log(cmd_args, url=args.url)


if __name__ == "__main__":
    main()
