import { AIProvider } from "@/context/StoreContext";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const POE_URL = "https://api.poe.com/v1/chat/completions";

export type GenerationMode = 'flashcards' | 'worksheet' | 'exam' | 'interactive_worksheet' | 'interactive_exam';

export interface GenerationParams {
    instruction: string;
    content: string;
    provider: AIProvider;
    model: string;
    apiKey: string;
    mode?: GenerationMode | string;
}

export async function generateCompletion({ instruction, content, provider, model, apiKey, mode = 'flashcards' }: GenerationParams) {
    const url = provider === 'openrouter' ? OPENROUTER_URL : POE_URL;

    let systemPrompt = '';

    if (mode === 'flashcards') {
        systemPrompt = `You are an expert educational psychologist and flashcard creator. 
Your goal is to transform complex information into clear, effective flashcards following the Minimum Information Principle.

RULES FOR FLASHCARD CREATION:
1. **Conciseness**: Keep cards short. One concept per card.
2. **Clarity**: Use simple language. Avoid ambiguity.
3. **Bold Key Terms**: Use double asterisks **like this** to highlight the most important terms or answers in the back of the card.
4. **Accuracy**: Ensure every card is factually correct based on the source material.
5. **Formatting**: Use real newlines or standard JSON-escaped newlines (\\n) for multi-step processes.

Return ONLY a valid JSON array of objects with "front" and "back" keys. Do not wrap in markdown code blocks.
Example: [{"front": "What is the powerhouse of the cell?", "back": "The **Mitochondria**."}]`;
    } else if (mode === 'worksheet') {
        systemPrompt = `You are an expert educator creating a student worksheet. 
Your goal is to create high-quality open-ended or fill-in-the-blank questions based on the content.

RULES FOR WORKSHEET CREATION:
1. **Diverse Questions**: Create a mix of conceptual and factual questions.
2. **Contextual**: Ensure questions require thinking, not just copying.
3. **Accuracy**: Ensure every question is solvable using the source material.
4. **Formatting**: Question should be in the "front" field, and the sample answer/explanation in the "back" field.

Return ONLY a valid JSON array of objects with "front" and "back" keys.`;
    } else if (mode === 'exam') {
        systemPrompt = `You are an expert examiner creating a formal test. 
Your goal is to create challenging, clear exam questions.

RULES FOR EXAM CREATION:
1. **Structured**: Questions should be rigorous and formal.
2. **Clear Objectives**: Each question should test a specific learning objective.
3. **Accuracy**: Every question must be factually sound.
4. **Formatting**: Question should be in the "front" field, and the answer key/scoring guide in the "back" field.

Return ONLY a valid JSON array of objects with "front" and "back" keys.`;
    } else if (mode === 'interactive_worksheet') {
        systemPrompt = `You are an expert educator creating an INTERACTIVE worksheet.
Your goal is to create engaging questions that encourage active recall and deep thinking.

RULES:
1. **Interactive Style**: Frame questions in a way that feels like a conversation or a puzzle.
2. **Scaffolded Learning**: Progress from easier to harder questions.
3. **Detailed Feedback**: In the "back" field, provide not just the answer, but a "Why?" explanation and a follow-up hint.

Return ONLY a valid JSON array of objects with "front" and "back" keys.`;
    } else if (mode === 'interactive_exam') {
        systemPrompt = `You are an expert examiner creating an INTERACTIVE diagnostic exam.
Your goal is to assess student understanding through rigorous questioning combined with immediate pedagogical feedback.

RULES:
1. **Deeper Analysis**: Create questions that require synthesis of multiple concepts.
2. **Marking Rubric**: In the "back" field, provide a clear rubric (e.g., 1 point for X, 2 points for Y).
3. **Immediate Correction**: Provide a "Common Pitfall" section in the answer field to help students understand where they might go wrong.

Return ONLY a valid JSON array of objects with "front" and "back" keys.`;
    }

    const userPrompt = `Instruction: ${instruction}\n\nContent: ${content}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://bpcfkashcard.vercel.app/",
                "X-Title": "bpcFkashcard",
            },
            body: JSON.stringify({
                model: model,
                messages: [
                    { role: "system", content: systemPrompt },
                    { role: "user", content: userPrompt },
                ],
                response_format: { type: "json_object" }
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || `API error: ${response.status}`);
        }

        const data = await response.json();
        const result = data.choices[0].message.content;

        // Handle potential extra formatting from AI
        const jsonMatch = result.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
            return JSON.parse(jsonMatch[0]);
        }

        return JSON.parse(result);
    } catch (error: any) {
        console.error("AI Generation failed:", error);
        throw error;
    }
}
