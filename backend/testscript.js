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

async function fetchCodingExercises() {
  try {
    console.log('Fetching first 5 rows from coding_exercises table...\n');
    
    const { data, error } = await supabase
      .from('coding_exercises')
      .select('*')
      .limit(5);

    if (error) {
      console.error('Error fetching data:', error);
      return;
    }

    if (!data || data.length === 0) {
      console.log('No data found in coding_exercises table.');
      return;
    }

    console.log(`Found ${data.length} rows:\n`);
    
    // Display the data in a formatted way
    data.forEach((row, index) => {
      console.log(`--- Row ${index + 1} ---`);
      Object.entries(row).forEach(([key, value]) => {
        console.log(`${key}: ${JSON.stringify(value)}`);
      });
      console.log('');
    });

  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

// Run the function
fetchCodingExercises();
