// Test script for AI functions without requiring the server
require('dotenv').config();

async function testClaudeFunctions() {
  try {
    console.log('🤖 Testing Claude AI Functions Directly...\n');

    // Check if Anthropic API key is set
    if (!process.env.ANTHROPIC_API_KEY) {
      console.error('❌ Missing ANTHROPIC_API_KEY in environment variables');
      console.log('Please add ANTHROPIC_API_KEY=your_key to your .env file');
      return;
    }

    // Import Anthropic SDK
    const Anthropic = require('@anthropic-ai/sdk');
    const anthropic = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const testPrompt = 'Explain how React hooks work, specifically useState and useEffect. Include examples of when to use each hook and common patterns.';

    // Test 1: Generate concept summary
    console.log('📝 Testing concept summary generation...');
    const summaryResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Please provide a concise summary of the key concepts from this prompt. Focus on the main learning objectives and important points that someone should understand:

"${testPrompt}"

Provide a clear, structured summary that could be used as a learning concept.`
        }
      ]
    });

    const summary = summaryResponse.content[0].type === 'text' ? summaryResponse.content[0].text : '';
    console.log('✅ Summary generated:');
    console.log(summary.substring(0, 300) + '...\n');

    // Test 2: Generate exercise
    console.log('🎯 Testing exercise generation...');
    const exerciseResponse = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: `Create a flashcard-style question and answer based on this concept summary:

"${summary}"

Format your response as JSON with "question" and "answer" fields. The question should test understanding of the key concept, and the answer should be clear and educational.`
        }
      ]
    });

    const exerciseContent = exerciseResponse.content[0].type === 'text' ? exerciseResponse.content[0].text : '';
    
    // Parse JSON response
    const jsonMatch = exerciseContent.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const exerciseData = JSON.parse(jsonMatch[0]);
      console.log('✅ Exercise generated:');
      console.log('   Question:', exerciseData.question);
      console.log('   Answer:', exerciseData.answer);
    } else {
      console.log('⚠️  Could not parse exercise JSON, raw response:');
      console.log(exerciseContent);
    }

    console.log('\n🎉 AI functions test completed successfully!');

  } catch (error) {
    console.error('💥 Test failed:', error);
    if (error.message.includes('API key')) {
      console.log('\n💡 Make sure your ANTHROPIC_API_KEY is valid and has sufficient credits.');
    }
  }
}

// Run the test
testClaudeFunctions();
