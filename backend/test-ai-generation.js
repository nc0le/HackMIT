const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase environment variables!');
  console.log('Please create a .env file with:');
  console.log('SUPABASE_URL=your_supabase_project_url');
  console.log('SUPABASE_ANON_KEY=your_supabase_anon_key');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function testAIGeneration() {
  try {
    console.log('🤖 Testing AI Exercise Generation...\n');

    // Step 1: Create a test prompt first
    console.log('📝 Step 1: Creating a test prompt...');
    
    // Note: You'll need to replace this with a real user ID from your Supabase Auth
    const testUserId = '00000000-0000-0000-0000-000000000001'; // Replace with real user ID
    
    const testPrompt = {
      user_id: testUserId,
      prompt_text: 'Explain how React hooks work, specifically useState and useEffect. Include examples of when to use each hook and common patterns.'
    };

    const { data: prompt, error: promptError } = await supabase
      .from('cursor_prompts')
      .insert(testPrompt)
      .select()
      .single();

    if (promptError) {
      console.error('❌ Error creating test prompt:', promptError);
      return;
    }

    console.log('✅ Test prompt created:', prompt.id);
    console.log('📄 Prompt text:', prompt.prompt_text.substring(0, 100) + '...\n');

    // Step 2: Test AI generation for different exercise types
    const exerciseTypes = ['flashcard', 'code', 'quiz'];
    
    for (const exerciseType of exerciseTypes) {
      console.log(`🎯 Step 2: Testing ${exerciseType} exercise generation...`);
      
      try {
        const response = await fetch('http://localhost:3000/api/exercises', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${supabaseKey}` // Using anon key for testing
          },
          body: JSON.stringify({
            generate_from_prompt: true,
            prompt_id: prompt.id,
            exercise_type: exerciseType
          })
        });

        const result = await response.json();

        if (!response.ok) {
          console.error(`❌ Error generating ${exerciseType} exercise:`, result);
          continue;
        }

        console.log(`✅ ${exerciseType} exercise generated successfully!`);
        console.log('�� Exercise details:');
        console.log(`   ID: ${result.data.id}`);
        console.log(`   Type: ${result.data.exercise_type}`);
        console.log(`   Question: ${result.data.question.substring(0, 100)}...`);
        console.log(`   Answer: ${result.data.answer.substring(0, 100)}...`);
        console.log(`   Concept: ${result.data.concepts.concept_name}`);
        console.log('');

      } catch (fetchError) {
        console.error(`❌ Network error for ${exerciseType}:`, fetchError.message);
      }
    }

    // Step 3: Verify exercises were created in database
    console.log('🔍 Step 3: Verifying exercises in database...');
    
    const { data: exercises, error: exercisesError } = await supabase
      .from('exercises')
      .select(`
        *,
        concepts (
          id,
          concept_name,
          status
        )
      `)
      .eq('user_id', testUserId)
      .order('created_at', { ascending: false })
      .limit(5);

    if (exercisesError) {
      console.error('❌ Error fetching exercises:', exercisesError);
      return;
    }

    console.log(`✅ Found ${exercises.length} exercises in database:`);
    exercises.forEach((exercise, index) => {
      console.log(`   ${index + 1}. ${exercise.exercise_type} - ${exercise.question.substring(0, 50)}...`);
    });

    console.log('\n🎉 AI Generation test completed successfully!');

  } catch (error) {
    console.error('💥 Test failed with error:', error);
  }
}

// Alternative test function that doesn't require a running server
async function testDirectAIFunctions() {
  try {
    console.log('🧪 Testing Claude AI functions directly...\n');

    // Import the AI functions (you might need to adjust the path)
    const { generateConceptSummary, generateExercise } = require('./lib/claude.ts');

    const testPrompt = 'Explain how React hooks work, specifically useState and useEffect. Include examples of when to use each hook and common patterns.';

    console.log('📝 Testing concept summary generation...');
    const summary = await generateConceptSummary(testPrompt);
    console.log('✅ Summary generated:', summary.substring(0, 200) + '...\n');

    console.log('🎯 Testing exercise generation...');
    const exercise = await generateExercise(summary, 'flashcard');
    console.log('✅ Exercise generated:');
    console.log('   Question:', exercise.question);
    console.log('   Answer:', exercise.answer);

  } catch (error) {
    console.error('❌ Direct AI test failed:', error);
  }
}

// Main execution
async function main() {
  console.log('🚀 Starting AI Generation Tests...\n');
  
  // Check if server is running
  try {
    const response = await fetch('http://localhost:3000/api/exercises', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${supabaseKey}`
      }
    });
    
    if (response.status === 401) {
      console.log('🔄 Server is running, testing full API...\n');
      await testAIGeneration();
    } else {
      console.log('⚠️  Server not running or unexpected response, testing AI functions directly...\n');
      await testDirectAIFunctions();
    }
  } catch (error) {
    console.log('⚠️  Server not running, testing AI functions directly...\n');
    await testDirectAIFunctions();
  }
}

// Run the tests
main();
