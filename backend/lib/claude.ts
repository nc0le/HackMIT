import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export async function generateConceptSummary(promptText: string): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: `Please provide a concise summary of the key concepts from this prompt. Focus on the main learning objectives and important points that someone should understand:

"${promptText}"

Provide a clear, structured summary that could be used as a learning concept.`
        }
      ]
    });

    return response.content[0].type === 'text' ? response.content[0].text : '';
  } catch (error) {
    console.error('Error generating concept summary:', error);
    throw new Error('Failed to generate concept summary');
  }
}

export async function generateExercise(
  conceptSummary: string, 
  exerciseType: 'flashcard' | 'code' | 'quiz'
): Promise<{ question: string; answer: string }> {
  try {
    let prompt = '';
    
    switch (exerciseType) {
      case 'flashcard':
        prompt = `Create a flashcard-style question and answer based on this concept summary:

"${conceptSummary}"

Format your response as JSON with "question" and "answer" fields. The question should test understanding of the key concept, and the answer should be clear and educational.`;
        break;
      case 'code':
        prompt = `Create a coding exercise based on this concept summary:

"${conceptSummary}"

Format your response as JSON with "question" and "answer" fields. The question should ask for code implementation or explanation, and the answer should include the correct code with comments.`;
        break;
      case 'quiz':
        prompt = `Create a multiple choice quiz question based on this concept summary:

"${conceptSummary}"

Format your response as JSON with "question" and "answer" fields. The question should be a multiple choice question with 4 options (A, B, C, D), and the answer should specify the correct option and brief explanation.`;
        break;
    }

    const response = await anthropic.messages.create({
      model: 'claude-3-sonnet-20240229',
      max_tokens: 1500,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0].type === 'text' ? response.content[0].text : '';
    
    // Parse JSON response
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Invalid JSON response from Claude');
    }
    
    const exerciseData = JSON.parse(jsonMatch[0]);
    
    if (!exerciseData.question || !exerciseData.answer) {
      throw new Error('Invalid exercise format from Claude');
    }
    
    return {
      question: exerciseData.question,
      answer: exerciseData.answer
    };
  } catch (error) {
    console.error('Error generating exercise:', error);
    throw new Error('Failed to generate exercise');
  }
}
