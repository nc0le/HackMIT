// @ts-ignore - Deno module, available at runtime
// @deno-types="https://deno.land/std@0.177.0/http/server.ts"
import { serve } from "std/http/server.ts";
// @ts-ignore - Deno module, available at runtime  
// @deno-types="https://esm.sh/@supabase/supabase-js@2"
import { createClient } from "@supabase/supabase-js";

// Type declarations for Deno environment
declare const Deno: {
  env: {
    get(key: string): string | undefined;
  };
};

// Type declarations for global objects
declare const console: {
  log(...args: any[]): void;
  error(...args: any[]): void;
  warn(...args: any[]): void;
  info(...args: any[]): void;
};

declare const JSON: {
  stringify(value: any, replacer?: (key: string, value: any) => any, space?: string | number): string;
  parse(text: string, reviver?: (key: string, value: any) => any): any;
};

// Type for the cursor prompt record
interface CursorPrompt {
  id: string;
  user_id: string;
  prompt_text: string;
  timestamp: string;
}

serve(async (req: Request): Promise<Response> => {
  try {
    // Initialize Supabase client with service role
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Try to parse the request payload to get the new record
    let newRecord: CursorPrompt | null = null;
    try {
      const payload = await req.json();
      newRecord = payload.record;
    } catch (parseError) {
      // No payload, that's okay
    }

    // Add a new row to cursor_summaries table to show the function was called
    const { data: summaryData, error: summaryError } = await supabase
      .from("cursor_summaries")
      .insert({
        triggered_by_prompt_id: newRecord?.id || null,
        triggered_by_user_id: newRecord?.user_id || null,
        function_called_at: new Date().toISOString(),
        status: "completed"
      })
      .select();

    if (summaryError) {
      return new Response(JSON.stringify({ error: "Failed to create summary record" }), { status: 500 });
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Function executed and summary created",
      summary_id: summaryData?.[0]?.id 
    }), { status: 200 });
  } catch (err) {
    return new Response(JSON.stringify({ error: "Unexpected error", details: `${err}` }), { status: 500 });
  }
});
