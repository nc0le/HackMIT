import os
from supabase import create_client, Client
from dotenv import load_dotenv
import requests
import threading

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
api_host: str = os.environ.get("BACKEND_URL")
api_url: str = f"{api_host}/api/exercises"
client: Client = create_client(url, key)

def upload_to_database(cursor_prompt: str, user_id: str):
  response = (
    client.table("cursor_prompts")
    .insert({
      "cursor_prompt": cursor_prompt,
      "user_id": user_id
      })
    .execute()
  )
  return response

def prompt_to_update(last_prompts: list[str], user_id: str):
  def background_request():
    payload = {
      "last_prompts": last_prompts,
      "user_id": user_id
    }

    headers = {
      "Content-Type": "application/json"
    }

    try:
      response = requests.post(
        api_url,
        json=payload,
        headers=headers,
        timeout=30
      )
      response.raise_for_status()  # Raises exception for 4xx/5xx status codes
    except requests.exceptions.RequestException as e:
      print(f"Error sending request to {api_url}: {e}")

  # Start in background - don't block terminal
  thread = threading.Thread(target=background_request, daemon=True)
  thread.start()