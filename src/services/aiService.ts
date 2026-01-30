import { AIProvider } from "@/context/StoreContext";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const POE_URL = "https://api.poe.com/v1/chat/completions"; // Assuming standard OpenAI-compatible Poe API if available, else custom logic

export interface GenerationParams {
    instruction: string;
    content: string;
    provider: AIProvider;
    apiKey: string;
}

export async function generateCompletion({ instruction, content, provider, apiKey }: GenerationParams) {
    const url = provider === 'openrouter' ? OPENROUTER_URL : POE_URL;

    const systemPrompt = `You are a professional flashcard generator. 
Create high-quality flashcards based on the user's content and specific instructions.
Return ONLY a valid JSON array of objects with "front" and "back" keys.
Example: [{"front": "Question?", "back": "Answer."}]`;

    const userPrompt = `Instruction: ${instruction}\n\nContent: ${content}`;

    try {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${apiKey}`,
                "Content-Type": "application/json",
                "HTTP-Referer": "https://flashcard-maker-pro.vercel.app", // Optional for OpenRouter
                "X-Title": "Flashcard AI Maker",
            },
            body: JSON.stringify({
                model: provider === 'openrouter' ? "google/gemini-2.0-flash-exp:free" : "default", // Adjusted for Poe if needed
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
