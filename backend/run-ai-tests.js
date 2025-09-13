#!/usr/bin/env node

const { exec } = require('child_process');
const path = require('path');

console.log('🚀 AI Generation Test Suite\n');

async function runTest(testName, testFile) {
  return new Promise((resolve) => {
    console.log(`\n📋 Running ${testName}...`);
    console.log('─'.repeat(50));
    
    exec(`node ${testFile}`, (error, stdout, stderr) => {
      if (error) {
        console.log(`❌ ${testName} failed:`);
        console.log(stderr);
      } else {
        console.log(`✅ ${testName} completed:`);
        console.log(stdout);
      }
      resolve();
    });
  });
}

async function main() {
  const tests = [
    {
      name: 'Direct AI Functions Test',
      file: 'test-ai-direct.js',
      description: 'Tests Claude AI functions directly without server'
    },
    {
      name: 'Simple API Test',
      file: 'test-ai-simple.js', 
      description: 'Tests API endpoint (requires server running)'
    },
    {
      name: 'Full API Test',
      file: 'test-ai-generation.js',
      description: 'Comprehensive API test with multiple exercise types'
    }
  ];

  console.log('Available tests:');
  tests.forEach((test, index) => {
    console.log(`  ${index + 1}. ${test.name} - ${test.description}`);
  });

  console.log('\n💡 Instructions:');
  console.log('1. Make sure your .env file has ANTHROPIC_API_KEY set');
  console.log('2. For API tests, start the server with: npm run dev');
  console.log('3. Update the testUserId in the test files with your real user ID');
  console.log('4. Run individual tests with: node <test-file-name>');
  console.log('5. Or run this script to see all test outputs\n');

  // Run the direct AI test first (doesn't require server)
  await runTest('Direct AI Functions Test', 'test-ai-direct.js');

  console.log('\n' + '='.repeat(60));
  console.log('🎯 To test the full API:');
  console.log('1. Start server: npm run dev');
  console.log('2. Run: node test-ai-simple.js');
  console.log('3. Or run: node test-ai-generation.js');
  console.log('='.repeat(60));
}

main();
