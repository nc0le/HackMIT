import re

ANSI_ESCAPE_RE = re.compile(r'\x1B\[[0-?]*[ -/]*[@-~]')

def clean_ansi(text):
    text = ANSI_ESCAPE_RE.sub('', text)
    return text.replace('\r', '')  # optional: remove carriage returns

def remove_bracketed_paste(text):
    return text.replace("\x1B[200~", "").replace("\x1B[201~", "")
  
def clean_terminal_input(raw_text):
    # Remove bracketed paste markers
    text = raw_text.replace("\x1B[200~", "").replace("\x1B[201~", "")
    # Remove other ANSI escape codes
    text = ANSI_ESCAPE_RE.sub('', text)
    # Remove carriage returns
    text = text.replace('\r', '')
    return text

def is_physical_enter(byte):
    """Check if the byte corresponds to a physical Enter keypress."""
    return byte in (10, 13)  # LF (\n) or CR (\r)
