import { AIProvider } from "@/context/StoreContext";

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const POE_URL = "https://corsproxy.io/?url=https://api.poe.com/v1/chat/completions";

export type GenerationMode = 'flashcards' | 'worksheet' | 'exam' | 'interactive_worksheet' | 'interactive_exam';

export interface GenerationParams {
  instruction: string;
  content: string;
  provider: AIProvider;
  model: string;
  apiKey: string;
  mode?: GenerationMode | string;
  onProgress?: (current: number, total: number) => void;
}

// Helper to chunk content intelligently
function chunkContent(text: string, maxChunkSize: number = 4000, forceParts?: number): string[] {
  if (forceParts && forceParts > 1) {
    const chunks: string[] = [];
    const partSize = Math.ceil(text.length / forceParts);
    for (let i = 0; i < forceParts; i++) {
      const start = i * partSize;
      let end = (i + 1) * partSize;

      // Try to find a sentence boundary near the split point
      if (end < text.length) {
        const nextPeriod = text.indexOf('.', end);
        if (nextPeriod !== -1 && nextPeriod - end < 500) {
          end = nextPeriod + 1;
        }
      } else {
        end = text.length;
      }

      const chunk = text.slice(start, end).trim();
      if (chunk) chunks.push(chunk);
      if (end >= text.length) break;
    }
    return chunks;
  }

  if (text.length <= maxChunkSize) return [text];

  const chunks: string[] = [];
  let currentChunk = '';
  const sentences = text.match(/[^.!?]+[.!?]+(\s+|$)/g) || [text];

  for (const sentence of sentences) {
    if ((currentChunk + sentence).length > maxChunkSize) {
      if (currentChunk.trim()) chunks.push(currentChunk.trim());
      currentChunk = sentence;
    } else {
      currentChunk += sentence;
    }
  }
  if (currentChunk.trim()) chunks.push(currentChunk.trim());
  return chunks;
}

function getRequestedCount(instruction: string): number | null {
  const match = instruction.match(/(\d+)/);
  return match ? parseInt(match[1], 10) : null;
}

export async function generateCompletion({ instruction, content, provider, model, apiKey, mode = 'flashcards', onProgress }: GenerationParams) {
  const url = provider === 'openrouter' ? OPENROUTER_URL : POE_URL;

  // Determine system prompt based on mode
  let systemPrompt = '';

  // Modes that return an Array and can be batched
  const isArrayMode = ['flashcards', 'worksheet', 'exam'].includes(mode);

  if (mode === 'flashcards') {
    systemPrompt = `You are a high-performance flashcard generator.
Your goal is to extract as many facts as possible for a goal of 1000+ cards.

TECHNICAL FORMAT:
- Output MUST be a consistent JSON array of objects.
- Each object MUST have "front" and "back" keys.
- Each flashcard must have ONE front and ONE back.

CONTENT RULES:
- Do not include explanations, introductions, or extra text.
- Use double asterisks **like this** for key terms in the "back".
- Be dense: Extract every discrete concept.

Return ONLY the JSON array.`;
  } else if (mode === 'worksheet') {
    systemPrompt = `You are a worksheet generator.
Create high-quality questions and answers based on the content.

FORMATTING RULES:
1. Output MUST be a valid JSON array of objects.
2. Each object MUST have "front" (Question) and "back" (Answer) keys.
3. Keep it consistent: Use ONLY JSON array format.
4. Each item must have one front and one back.
5. Do not include explanations, introductions, or extra text.

Return ONLY the JSON array.`;
  } else if (mode === 'exam') {
    systemPrompt = `You are an exam generator.
Create formal questions and answers based on the content.

FORMATTING RULES:
1. Output MUST be a valid JSON array of objects.
2. Each object MUST have "front" (Question) and "back" (Answer) keys.
3. Keep it consistent: Use ONLY JSON array format.
4. Each item must have one front and one back.
5. Do not include explanations, introductions, or extra text.

Return ONLY the JSON array.`;
  } else if (mode === 'interactive_worksheet') {
    // ... (systemPrompt for interactive_worksheet - keeping structure but adhering to 'no extra text')
    systemPrompt = `You are an interactive worksheet generator. Return ONLY a valid JSON object.
No explanations, introductions, or extra text outside the JSON.

Structure:
{
  "title": "Title",
  "questions": [
    {
      "question": "text",
      "options": ["A", "B", "C", "D"],
      "correctAnswer": "A",
      "explanation": "why"
    }
  ]
}`;
  } else if (mode === 'interactive_exam') {
    systemPrompt = `You are a CBT exam generator. Return ONLY a valid JSON object.
No explanations, introductions, or extra text outside the JSON.

Structure:
{
  "subjects": [
    {
      "id": "subject_id",
      "title": "Subject Name",
      "questions": [
        {
          "question": "text",
          "options": ["A", "B", "C", "D"],
          "correctAnswer": "A"
        }
      ]
    }
  ]
}`;
  }

  // Determine how to process
  let contentChunks = [content];
  let forcedParts = 0;

  if (isArrayMode) {
    const requestedCount = getRequestedCount(instruction);
    if (requestedCount !== null) {
      if (requestedCount >= 1000) forcedParts = 5;
      else if (requestedCount >= 500) forcedParts = 3;
      else if (requestedCount > 0) forcedParts = 2;
    }

    if (forcedParts > 0 || content.length > 2000) {
      contentChunks = chunkContent(content, 2000, forcedParts);
    }
  }

  const allResults: any[] = [];

  for (let i = 0; i < contentChunks.length; i++) {
    let chunk = contentChunks[i];
    let attempt = 0;
    let maxAttempts = 2;
    let success = false;

    while (attempt < maxAttempts && !success) {
      attempt++;

      // Notify progress
      if (onProgress && contentChunks.length > 1) {
        onProgress(i + 1, contentChunks.length);
      }

      const currentAttemptPrompt = attempt > 1
        ? `RETRY: The previous attempt for this part produced nothing. PLEASE EXTRACT FACTS AND RETURN JSON ARRAY. \n\nContent: ${chunk}`
        : `Instruction: ${instruction}\n\nContent (Part ${i + 1}/${contentChunks.length}): ${chunk}`;

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
              { role: "user", content: currentAttemptPrompt },
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

        let cleanResult = result.trim();
        if (cleanResult.startsWith('```')) {
          cleanResult = cleanResult.replace(/^```(json)?\n?/, '').replace(/```$/, '').trim();
        }

        let parsedResult = JSON.parse(cleanResult);

        // Fallback for wrapped objects
        if (isArrayMode) {
          let items = Array.isArray(parsedResult) ? parsedResult : (parsedResult.questions || parsedResult.cards || parsedResult.flashcards);
          if (items && Array.isArray(items) && items.length > 0) {
            allResults.push(...items);
            success = true;
          } else if (parsedResult.front && parsedResult.back) {
            // Single object fallback
            allResults.push(parsedResult);
            success = true;
          }
        } else {
          // Object modes
          if (parsedResult) {
            return parsedResult;
          }
        }
      } catch (error: any) {
        console.error(`Attempt ${attempt} failed for chunk ${i + 1}:`, error);
        if (attempt === maxAttempts) throw error;
      }
    }
  }

  return allResults;
}
