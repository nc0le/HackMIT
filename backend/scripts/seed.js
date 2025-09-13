const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function seedData() {
  console.log('Starting seed script...');

  try {
    // Note: Replace this with a real user ID from your Supabase Auth users
    // You can get this by signing up a test user or checking your Supabase dashboard
    const testUserId = '00000000-0000-0000-0000-000000000001'; // Replace with real user ID
    
    console.log('Seeding cursor_prompts...');
    
    // Insert sample prompts
    const { data: prompts, error: promptError } = await supabase
      .from('cursor_prompts')
      .insert([
        {
          user_id: testUserId,
          prompt_text: 'Explain how React hooks work and when to use useState vs useEffect'
        },
        {
          user_id: testUserId,
          prompt_text: 'How do I implement authentication in Next.js with Supabase?'
        },
        {
          user_id: testUserId,
          prompt_text: 'What are the differences between SQL and NoSQL databases?'
        }
      ])
      .select();

    if (promptError) {
      console.error('Error inserting prompts:', promptError);
      return;
    }

    console.log('Inserted prompts:', prompts);

    console.log('Seeding concepts...');
    
    // Insert sample concepts
    const { data: concepts, error: conceptError } = await supabase
      .from('concepts')
      .insert([
        {
          user_id: testUserId,
          concept_name: 'React Hooks',
          source_prompt_id: prompts[0].id,
          status: 'learning'
        },
        {
          user_id: testUserId,
          concept_name: 'Next.js Authentication',
          source_prompt_id: prompts[1].id,
          status: 'unlearned'
        },
        {
          user_id: testUserId,
          concept_name: 'Database Types',
          source_prompt_id: prompts[2].id,
          status: 'unlearned'
        },
        {
          user_id: testUserId,
          concept_name: 'JavaScript Fundamentals',
          status: 'mastered'
        }
      ])
      .select();

    if (conceptError) {
      console.error('Error inserting concepts:', conceptError);
      return;
    }

    console.log('Inserted concepts:', concepts);

    console.log('Seeding exercises...');
    
    // Insert sample exercises
    const { data: exercises, error: exerciseError } = await supabase
      .from('exercises')
      .insert([
        {
          user_id: testUserId,
          concept_id: concepts[0].id,
          exercise_type: 'flashcard',
          question: 'What is the purpose of the useState hook in React?',
          answer: 'useState is a React hook that allows functional components to manage local state. It returns an array with the current state value and a function to update it.',
          completed: true,
          ai_feedback: {
            score: 85,
            feedback: 'Good understanding of useState basics. Try to include examples in your explanation.',
            areas_to_improve: ['Examples', 'Advanced usage']
          }
        },
        {
          user_id: testUserId,
          concept_id: concepts[0].id,
          exercise_type: 'code',
          question: 'Write a React component that uses useState to manage a counter that can be incremented and decremented.',
          answer: 'function Counter() { const [count, setCount] = useState(0); return (<div><p>Count: {count}</p><button onClick={() => setCount(count + 1)}>+</button><button onClick={() => setCount(count - 1)}>-</button></div>); }',
          completed: false
        },
        {
          user_id: testUserId,
          concept_id: concepts[1].id,
          exercise_type: 'quiz',
          question: 'Which of the following is required to set up Supabase authentication in Next.js? A) API Routes B) Environment variables C) Supabase client D) All of the above',
          answer: 'D) All of the above',
          completed: false
        },
        {
          user_id: testUserId,
          concept_id: concepts[2].id,
          exercise_type: 'flashcard',
          question: 'What is the main difference between SQL and NoSQL databases?',
          answer: 'SQL databases use structured tables with predefined schemas and relationships, while NoSQL databases are more flexible, storing data in various formats like documents, key-value pairs, or graphs without requiring a fixed schema.',
          completed: false
        }
      ])
      .select();

    if (exerciseError) {
      console.error('Error inserting exercises:', exerciseError);
      return;
    }

    console.log('Inserted exercises:', exercises);
    console.log('Seed script completed successfully!');

  } catch (error) {
    console.error('Seed script failed:', error);
  }
}

seedData();
