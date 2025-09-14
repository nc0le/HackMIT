const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAIGeneration() {
  try {
    console.log('🤖 Testing AI Exercise Generation...\n');

    // Step 1: Create a test prompt
    console.log('📝 Creating test prompt...');
    
    // Replace with your actual user ID from Supabase Auth
    const testUserId = '00000000-0000-0000-0000-000000000001';
    
    const { data: prompt, error: promptError } = await supabase
      .from('cursor_prompts')
      .insert({
        user_id: testUserId,
        prompt_text: 'Explain how React hooks work, specifically useState and useEffect. Include examples of when to use each hook and common patterns.'
      })
      .select()
      .single();

    if (promptError) {
      console.error('❌ Error creating prompt:', promptError);
      return;
    }

    console.log('✅ Prompt created:', prompt.id);

    // Step 2: Test AI generation
    console.log('🎯 Generating flashcard exercise...');
    
    const response = await fetch('http://localhost:3000/api/exercises', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        generate_from_prompt: true,
        prompt_id: prompt.id,
        exercise_type: 'flashcard'
      })
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('❌ Error:', result);
      return;
    }

    console.log('✅ Exercise generated successfully!');
    console.log('📋 Results:');
    console.log('   Question:', result.data.question);
    console.log('   Answer:', result.data.answer);
    console.log('   Concept:', result.data.concepts.concept_name);

  } catch (error) {
    console.error('💥 Test failed:', error);
  }
}

// Run the test
testAIGeneration();
