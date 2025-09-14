import Anthropic from "@anthropic-ai/sdk";

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY,
});

function generateConceptSummaryPrompt(
    priorPrompts: [string],
    priorConcepts: [Concept]
): string {
    const promptsList = priorPrompts
        .map((prompt, index) => `${index + 1}. ${prompt}`)
        .join("\n");
    const conceptsList = priorConcepts
        .map(
            (concept, index) =>
                `${index + 1}. Title: "${concept.title}" - Description: "${
                    concept.description
                }"`
        )
        .join("\n");

    let prompt = `Imagine you are a seasoned CS professor tasked with pinpointing a programmer's weak areas and recommending key concepts to improve. Read through this list of coding prompts they have given to an AI Coding assistant (i.e. cursor):

${promptsList}

Identify recurring themes, struggles, or repeated requests (e.g., "center a div" appearing often means the learner struggles with layout and alignment in CSS). For each recurring theme, extract a generalized coding concept that could be taught to help the learner improve (e.g., "Flexbox Model Centering Techniques"). Group similar ideas into one concept, so that there are three concepts in total. For example, the centering a div example from earlier could go in a category with other exercises called "Flexbox Layout". Prioritize clarity and conciseness: each concept should be 3–7 words and written in a way that makes sense as a teachable skill. Make sure that ONLY 3 concepts are output, no more, no less. If there are prior concepts that have been generated, look at that table:

${conceptsList}

If any of the new concepts are very similar to it, do not come up with a new concept name, use the same name as the old concept.`;
    console.log(prompt);
    return prompt;
}

//export async function generateConceptSummary(priorPrompts: [string], priorConcepts ): Promise<string> {
export async function generateConceptSummary(
    priorPrompts: [string],
    priorConcepts: [Concept]
): Promise<Concept[]> {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-7-sonnet-latest",
            max_tokens: 1024,
            tools: [
                {
                    name: "select_concepts",
                    description:
                        "Chosen concepts in programming for a user using well-structured JSON.",
                    input_schema: {
                        type: "object",
                        properties: {
                            concepts: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        is_new: {
                                            type: "boolean",
                                            description:
                                                "Whether or not the concept is new",
                                        },
                                        concept_title: {
                                            type: "string",
                                            description:
                                                'Short title of the concept, eg "Centering a Div" or "Abstract Classes"',
                                        },
                                        concept_description: {
                                            type: "string",
                                            description:
                                                "Maximum 2 sentence description of the concept",
                                        },
                                    },
                                    required: [
                                        "is_new",
                                        "concept_title",
                                        "concept_description",
                                    ],
                                },
                                description:
                                    "Key programming concepts to learn. Limit to 3 max.",
                            },
                        },
                    },
                },
            ],
            tool_choice: { type: "tool", name: "select_concepts" },
            messages: [
                {
                    role: "user",
                    content: generateConceptSummaryPrompt(
                        priorPrompts,
                        priorConcepts
                    ),
                },
            ],
        });

        // Extract tool response
        const toolUse = response.content.find(
            (content) => content.type === "tool_use"
        );
        if (!toolUse || toolUse.type !== "tool_use") {
            throw new Error("No tool use found in response");
        }

        const toolResponse = toolUse.input as any;
        console.log("Tool response:", toolResponse);

        // Process each concept in the response
        const processedConcepts: Concept[] = toolResponse.concepts.map(
            (conceptData) => {
                if (conceptData.is_new) {
                    // Create new Concept object
                    return {
                        id: null, // Will be generated by database
                        created_at: null, // Will be set by database
                        user_id: priorConcepts[0]?.user_id || "temp", // Use existing user_id or fallback
                        title: conceptData.concept_title,
                        description: conceptData.concept_description,
                        skillLevel: 1, // Default skill level for new concepts
                    };
                } else {
                    // Find matching concept in priorConcepts
                    const matchingConcept = priorConcepts.find(
                        (concept) =>
                            concept.title.toLowerCase().trim() ===
                            conceptData.concept_title.toLowerCase().trim()
                    );

                    if (matchingConcept) {
                        return matchingConcept;
                    } else {
                        // Fallback: create new concept if no match found
                        console.warn(
                            `No matching concept found for: ${conceptData.concept_title}`
                        );
                        return {
                            id: null,
                            created_at: null,
                            user_id: priorConcepts[0]?.user_id || "temp",
                            title: conceptData.concept_title,
                            description: conceptData.concept_description,
                            skillLevel: 1,
                        };
                    }
                }
            }
        );

        return processedConcepts;
    } catch (error) {
        console.error("Error generating concept summary:", error);
        throw new Error("Failed to generate concept summary");
    }
}

function generateExercisePrompt(exerciseType, concepts: [Concept]) {
    const conceptsList = concepts
        .map(
            (concept, index) =>
                `${index + 1}. Title: "${concept.title}" - Description: "${
                    concept.description
                }" - Skill Level: ${concept.skillLevel}`
        )
        .join("\n");

    let prompt = `Imagine you are a seasoned CS professor tasked with creating practice problems for specific coding concepts a student can improve on. You are given a list of three key concepts a coder needs to work on here: 

    ${conceptsList} 
    
    Using that list, generate three coding exercises total for the concepts. Consider the skillLevel (1 = beginner, 5 = advanced) to determine the difficulty of the exercise. The output must be strictly JSON, do not structure it in any other way. Each concept in the JSON should have exactly four elements: 
  
  concept_names: Must exactly match the name(s) of the concept(s) from the input table.
  title: title for the exercise. should be short
  description: Instructions for the coding exercise and how it relates to the concept(s), about 3 sentences long.
  exercise_code: The code for the exercise. Make it concise, clear, and properly formatted with spaces and indentation, just enough for the student to practice the concept. Always follow this format and ensure the JSON is valid.`;
    console.log(prompt);
    return prompt;
}

export async function generateExercise(
    concepts: [Concept],
    exerciseType: "code"
): Promise<ExerciseInsert[]> {
    try {
        let prompt = "";
        const response = await anthropic.messages.create({
            model: "claude-3-7-sonnet-latest",
            max_tokens: 1500,
            tools: [
                {
                    name: "exercises",
                    description:
                        "Shows a student exercises based on a precise description using well-structured JSON",
                    input_schema: {
                        type: "object",
                        properties: {
                            exercises: {
                                type: "array",
                                items: {
                                    type: "object",
                                    properties: {
                                        concept_names: {
                                            type: "array",
                                            items: {
                                                type: "string",
                                                description:
                                                    "Related concept. Must exactly match the name of the concept from the input table",
                                            },
                                            description:
                                                "Concepts (1 or more) that the problem relates to. Cannot be empty.",
                                        },
                                        title: {
                                            type: "string",
                                            description:
                                                "Title for the exercise. Should be a couple words, like 'Center a Div' or 'FizzBuzz'",
                                        },
                                        description: {
                                            type: "string",
                                            description:
                                                "Instructions for the coding exercise and how it relates to the concept(s), about 3 sentences long",
                                        },
                                        exercise_code: {
                                            type: "string",
                                            description:
                                                "The code for the exercise. Make it concise, clear, and properly formatted with spaces and indentation, just enough for the student to practice the concept",
                                        },
                                    },
                                    required: [
                                        "concept_names",
                                        "title",
                                        "description",
                                        "exercise_code",
                                    ],
                                },
                            },
                        },
                    },
                },
            ],
            tool_choice: { type: "tool", name: "exercises" },
            messages: [
                {
                    role: "user",
                    content: generateExercisePrompt(exerciseType, concepts),
                },
            ],
        });

        // Extract tool response
        const toolUse = response.content.find(
            (content) => content.type === "tool_use"
        );
        if (!toolUse || toolUse.type !== "tool_use") {
            throw new Error("No tool use found in response");
        }

        const toolResponse = toolUse.input as any;
        console.log("Tool response:", toolResponse);

        // Convert tool response to ExerciseInsert array
        const exercises: ExerciseInsert[] = toolResponse.exercises.map((exerciseData: any, index: number) => ({
            user_id: concepts[0]?.user_id || "temp", // Use user_id from first concept
            title: exerciseData.title,
            description: exerciseData.description,
            concepts: exerciseData.concept_names, // Array of concept names
            code: exerciseData.exercise_code,
            completed: false
        }));

        return exercises;
    } catch (error) {
        console.error("Error generating exercise:", error);
        throw new Error("Failed to generate exercise");
    }
}

export async function analyzeSolution(
    code: string
): Promise<{ correct: boolean; feedback: string }> {
    try {
        const response = await anthropic.messages.create({
            model: "claude-3-7-sonnet-latest",
            max_tokens: 1000,
            messages: [
                {
                    role: "user",
                    content: `Please analyze this FizzBuzz solution and provide feedback:

  ${code}

  The task is: Write a function that prints the numbers from 1 to 100. But for multiples of
  three, print "Fizz" instead of the number, and for multiples of five, print "Buzz". For
  numbers which are multiples of both three and five, print "FizzBuzz".

  Please respond in JSON format with the following structure: Only include raw JSON. Do not include anything else.
  {
    "correct": boolean,
    "feedback": "string with detailed feedback"
  }

  If the solution is correct, set "correct" to true and provide positive feedback. If
  incorrect, set "correct" to false and provide specific feedback on what needs to be
  improved.`,
                },
            ],
        });

        const content =
            response.content[0].type === "text" ? response.content[0].text : "";

        const result = JSON.parse(content);
        return {
            correct: result.correct,
            feedback: result.feedback,
        };
    } catch (error) {
        console.error("Error analyzing FizzBuzz solution:", error);
        throw new Error("Failed to analyze FizzBuzz solution");
    }
}
