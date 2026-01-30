import { AIProvider } from "@/context/StoreContext";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const POE_URL = "https://api.poe.com/v1/chat/completions";

export interface GenerationParams {
    instruction: string;
    content: string;
    provider: AIProvider;
    model: string;
    apiKey: string;
}

export async function generateCompletion({ instruction, content, provider, model, apiKey }: GenerationParams) {
    const url = provider === 'openrouter' ? OPENROUTER_URL : POE_URL;

    const systemPrompt = `You are an expert educational psychologist and flashcard creator. 
Your goal is to transform complex information into clear, effective flashcards following the Minimum Information Principle.

RULES FOR FLASHCARD CREATION:
1. **Conciseness**: Keep cards short. One concept per card.
2. **Clarity**: Use simple language. Avoid ambiguity.
3. **Bold Key Terms**: Use double asterisks **like this** to highlight the most important terms or answers in the back of the card.
4. **Accuracy**: Ensure every card is factually correct based on the source material.
5. **Formatting**: Use Markdown for newlines (\n\n) if explaining a multi-step process.

Return ONLY a valid JSON array of objects with "front" and "back" keys.
Example: [{"front": "What is the powerhouse of the cell?", "back": "The **Mitochondria**."}]`;

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
