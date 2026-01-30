import OpenAI from 'openai';

// This service will act as a wrapper for OpenRouter or Poe
// For now, we will structure it to expect an API Key from the user (via settings)

export interface AICompletionRequest {
    systemPrompt: string;
    userPrompt: string;
    apiKey: string;
    baseUrl?: string;
    model?: string;
}

export const generateCompletion = async ({
    systemPrompt,
    userPrompt,
    apiKey,
    baseUrl = "https://openrouter.ai/api/v1",
    model = "openai/gpt-3.5-turbo"
}: AICompletionRequest): Promise<string> => {
    if (!apiKey) throw new Error("API Key is required");

    // OpenAI Library can work with OpenRouter if baseUrl is set
    const client = new OpenAI({
        apiKey: apiKey,
        baseURL: baseUrl,
        dangerouslyAllowBrowser: true // Running in browser for this app
    });

    const completion = await client.chat.completions.create({
        messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: userPrompt }
        ],
        model: model,
    });

    return completion.choices[0].message.content || "";
};
