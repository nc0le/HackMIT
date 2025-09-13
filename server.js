const express = require('express');
const path = require('path');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Serve static files from the current directory
app.use(express.static('.'));

// Route to serve the main HTML file
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// API endpoint to submit code to Claude
app.post('/api/submit-code', async (req, res) => {
    try {
        const { code } = req.body;
        
        // Debug: Log what we received
        console.log('Received code from client:', code);
        
        if (!process.env.CLAUDE_API_KEY) {
            console.log('Error: Claude API key not configured');
            return res.status(500).json({ 
                success: false, 
                error: 'Claude API key not configured' 
            });
        }

        console.log('Making API call to Claude...');
        
        const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'x-api-key': process.env.CLAUDE_API_KEY,
                'anthropic-version': '2023-06-01'
            },
            body: JSON.stringify({
                model: 'claude-sonnet-4-20250514',
                max_tokens: 1000,
                messages: [{
                    role: 'user',
                    content: `Please analyze this FizzBuzz solution and provide feedback:

${code}

The task is: Write a function that prints the numbers from 1 to 100. But for multiples of three, print "Fizz" instead of the number, and for multiples of five, print "Buzz". For numbers which are multiples of both three and five, print "FizzBuzz".

Please respond with either "CORRECT" if the solution is correct, or provide specific feedback on what needs to be improved.`
                }]
            })
        });

        console.log('Claude API response status:', response.status);
        const result = await response.json();
        console.log('Claude API response:', result);
        
        if (response.ok && result.content && result.content[0]) {
            const feedback = result.content[0].text;
            const isCorrect = feedback.includes('CORRECT');
            
            res.json({
                success: true,
                correct: isCorrect,
                feedback: feedback
            });
        } else {
            console.error('Claude API error:', result);
            res.status(500).json({ 
                success: false, 
                error: 'Failed to get response from Claude' 
            });
        }
    } catch (error) {
        console.error('Error calling Claude:', error);
        res.status(500).json({ 
            success: false, 
            error: 'Internal server error' 
        });
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log('Press Ctrl+C to stop the server');
});
