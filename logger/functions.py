import os
from supabase import create_client, Client
from dotenv import load_dotenv

load_dotenv()

url: str = os.environ.get("SUPABASE_URL")
key: str = os.environ.get("SUPABASE_KEY")
client: Client = create_client(url, key)

USER_ID="temp"

def upload_to_database(cursor_prompt: str):
  response = (
      client.table("cursor_prompts")
      .insert({
        "cursor_prompt": cursor_prompt,
        "user_id": USER_ID
        })
      .execute()
  )
  return response