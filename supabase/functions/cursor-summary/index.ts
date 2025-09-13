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
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")
    );

    // Fetch and display ALL records from cursor_prompts table
    console.log("📋 Fetching all records from cursor_prompts table...");
    const { data: allPrompts, error } = await supabase
      .from("cursor_prompts")
      .select("*")
      .order("timestamp", { ascending: false });

    if (error) {
      console.error("❌ Error fetching prompts:", error);
      return new Response(JSON.stringify({ error: "Failed to fetch prompts" }), { status: 500 });
    }

    // Print the entire table
    console.log("📊 CURSOR_PROMPTS TABLE CONTENTS:");
    console.log("=====================================");
    console.log(`Total records: ${allPrompts?.length || 0}`);
    
    if (allPrompts && allPrompts.length > 0) {
      allPrompts.forEach((prompt: any, index: number) => {
        console.log(`\n${index + 1}. Record:`);
        console.log(`   ID: ${prompt.id}`);
        console.log(`   User ID: ${prompt.user_id}`);
        console.log(`   Prompt Text: ${prompt.prompt_text}`);
        console.log(`   Timestamp: ${prompt.timestamp}`);
        console.log(`   ---`);
      });
    } else {
      console.log("📋 Table is empty - no records found");
    }
    console.log("=====================================");

    // Try to parse the request payload if it exists
    try {
      const payload = await req.json();
      const newRecord: CursorPrompt = payload.record;
      
      if (newRecord) {
        console.log("\n🎯 NEW RECORD DETECTED IN PAYLOAD:");
        console.log(`📝 Prompt ID: ${newRecord.id}`);
        console.log(`👤 User ID: ${newRecord.user_id}`);
        console.log(`📄 Prompt Text: ${newRecord.prompt_text}`);
        console.log(`⏰ Timestamp: ${newRecord.timestamp}`);
      }
    } catch (parseError) {
      console.log("\n⚠️ No valid JSON payload in request");
    }

    console.log("\n✅ Table contents printed successfully!");
    return new Response(JSON.stringify({ success: true, message: "Table contents printed" }), { status: 200 });
  } catch (err) {
    console.error("❌ Function error:", err);
    return new Response(JSON.stringify({ error: "Unexpected error", details: `${err}` }), { status: 500 });
  }
});
