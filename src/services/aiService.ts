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
  onProgress?: (current: number, total: number) => void;
}

// Helper to chunk content intelligently
function chunkContent(text: string, maxChunkSize: number = 4000): string[] {
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

export async function generateCompletion({ instruction, content, provider, model, apiKey, mode = 'flashcards', onProgress }: GenerationParams) {
  const url = provider === 'openrouter' ? OPENROUTER_URL : POE_URL;

  // Determine system prompt based on mode
  let systemPrompt = '';

  // Modes that return an Array and can be batched
  const isArrayMode = ['flashcards', 'worksheet', 'exam'].includes(mode);

  if (mode === 'flashcards') {
    systemPrompt = `You are an expert educational psychologist and flashcard creator.
Your goal is to transform complex information into clear, effective flashcards following the Minimum Information Principle.

RULES FOR FLASHCARD CREATION:
1. **Conciseness**: Keep cards short. One concept per card.
2. **Clarity**: Use simple language. Avoid ambiguity.
3. **High Density**: Extract as many discrete facts as possible. Do not skip details. Aim for total coverage.
4. **Bold Key Terms**: Use double asterisks **like this** to highlight the most important terms or answers in the back of the card.
5. **Accuracy**: Ensure every card is factually correct based on the source material.
6. **Formatting**: Use real newlines or standard JSON-escaped newlines (\\n) for multi-step processes.

Return ONLY a valid JSON array of objects with "front" and "back" keys. Do not wrap in markdown code blocks.`;
  } else if (mode === 'worksheet') {
    systemPrompt = `You are an expert educator creating a student worksheet.
Your goal is to create high-quality open-ended or fill-in-the-blank questions based on the content.

RULES FOR WORKSHEET CREATION:
1. **Diverse Questions**: Create a mix of conceptual and factual questions.
2. **Contextual**: Ensure questions require thinking, not just copying.
3. **Accuracy**: Ensure every question is solvable using the source material.
4. **Formatting**: Question should be in the "front" field, and the sample answer/explanation in the "back" field.

Return ONLY a valid JSON array of objects with "front" and "back" keys. Do not wrap in markdown code blocks.`;
  } else if (mode === 'exam') {
    systemPrompt = `You are an expert examiner creating a formal test.
Your goal is to create challenging, clear exam questions.

RULES FOR EXAM CREATION:
1. **Structured**: Questions should be rigorous and formal.
2. **Clear Objectives**: Each question should test a specific learning objective.
3. **Accuracy**: Every question must be factually sound.
4. **Formatting**: Question should be in the "front" field, and the answer key/scoring guide in the "back" field.

Return ONLY a valid JSON array of objects with "front" and "back" keys. Do not wrap in markdown code blocks.`;
  } else if (mode === 'interactive_worksheet') {
    systemPrompt = `You are an expert educator creating an INTERACTIVE worksheet.
Your goal is to create engaging questions that encourage active recall and deep thinking.

RULES:
1. **Interactive Style**: Frame questions in a way that feels like a conversation or a puzzle.
2. **Scaffolded Learning**: Progress from easier to harder questions.
3. **Detailed Feedback**: Provide a "Why?" explanation for the answer.

Return ONLY a valid JSON object with this exact structure:
{
  "title": "Worksheet Title",
  "questions": [
    {
      "question": "Question text?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctAnswer": "Option A",
      "explanation": "Explanation of why this is correct."
    }
  ]
}
Do not wrap in markdown code blocks.`;
  } else if (mode === 'interactive_exam') {
    systemPrompt = `You are an expert exam creator for a Computer-Based Test (CBT) system.
Your goal is to create a comprehensive exam with multiple subjects based on the provided content/topic.

RULES:
1. **Structure**: Return a JSON object with a "subjects" array.
2. **Subjects**: Create 4 distinct subjects related to the topic (e.g., Math, Science, Language, Social Studies - or specific sub-topics if the content is narrow).
3. **Questions**: Generate 10 high-quality multiple-choice questions per subject.
4. **Options**: Provide exactly 4 options per question.
5. **Correct Answer**: Specify the correct option (A, B, C, or D).

Return ONLY a valid JSON object with this exact structure:
{
  "subjects": [
    {
      "id": "subject_id",
      "title": "Subject Name",
      "questions": [
        {
          "question": "Question text?",
          "options": ["Option A", "Option B", "Option C", "Option D"],
          "correctAnswer": "A"
        }
      ]
    }
  ]
}
Do not wrap in markdown code blocks.`;
  }

  // Determine how to process
  let contentChunks = [content];

  // Only chunk if it's an Array mode and content is long (> 2000 chars)
  // Reducing chunk size to ~2000 chars and asking for high density helps reach the 1000+ cards goal.
  if (isArrayMode && content.length > 2000) {
    contentChunks = chunkContent(content, 2000);
  }

  const allResults: any[] = [];

  for (let i = 0; i < contentChunks.length; i++) {
    const chunk = contentChunks[i];

    // Notify progress
    if (onProgress && contentChunks.length > 1) {
      onProgress(i + 1, contentChunks.length);
    }

    const userPrompt = `Instruction: ${instruction}\n\nContent (Part ${i + 1}/${contentChunks.length}): ${chunk}`;

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
      let cleanResult = result.trim();

      // Remove markdown code blocks if present
      if (cleanResult.startsWith('```')) {
        cleanResult = cleanResult.replace(/^```(json)?\n?/, '').replace(/```$/, '').trim();
      }

      let parsedResult: any;

      // Attempt to parse the cleaned result
      try {
        parsedResult = JSON.parse(cleanResult);
      } catch (e) {
        // If direct parsing fails, try to find the JSON structure
        const jsonMatch = cleanResult.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
        if (jsonMatch) {
          try {
            parsedResult = JSON.parse(jsonMatch[0]);
          } catch (e2) {
            console.error("Failed to parse extracted JSON:", e2);
            // If one chunk fails, strictly we might want to continue, but for now throw
            throw new Error(`Invalid response format from AI in part ${i + 1}`);
          }
        } else {
          throw new Error(`Invalid response format from AI in part ${i + 1}`);
        }
      }

      if (isArrayMode) {
        if (Array.isArray(parsedResult)) {
          allResults.push(...parsedResult);
        } else if (parsedResult.questions && Array.isArray(parsedResult.questions)) {
          // Handle case where AI wraps array in object key 'questions'
          allResults.push(...parsedResult.questions);
        } else if (parsedResult.cards && Array.isArray(parsedResult.cards)) {
          allResults.push(...parsedResult.cards);
        } else {
          // It returned a single object? Push it if it looks like a card, else warning
          if (parsedResult.front && parsedResult.back) {
            allResults.push(parsedResult);
          }
        }
      } else {
        // For object modes (interactive), we only support single chunk for now, so return immediately
        return parsedResult;
      }

    } catch (error: any) {
      console.error(`AI Generation failed for part ${i + 1}:`, error);
      throw error;
    }
  }

  return allResults;
}
