import { GoogleGenerativeAI } from '@google/generative-ai';
import { SYSTEM_PROMPT } from './prompts';

let genAI: GoogleGenerativeAI | null = null;

function getClient(): GoogleGenerativeAI {
  if (!genAI) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set');
    }
    genAI = new GoogleGenerativeAI(apiKey);
  }
  return genAI;
}

export async function generateContent(prompt: string): Promise<string> {
  const client = getClient();
  const model = client.getGenerativeModel({
    model: 'gemini-3.6-flash',
    systemInstruction: SYSTEM_PROMPT,
  });

  const result = await model.generateContent(prompt);
  const response = result.response;
  const text = response.text();

  return text;
}

export async function parseJsonResponse<T>(prompt: string): Promise<T> {
  const raw = await generateContent(prompt);

  // Extract JSON from the response (handle markdown code blocks)
  let jsonString = raw.trim();

  // Remove markdown code block wrappers if present
  if (jsonString.startsWith('```json')) {
    jsonString = jsonString.slice(7);
  } else if (jsonString.startsWith('```')) {
    jsonString = jsonString.slice(3);
  }
  if (jsonString.endsWith('```')) {
    jsonString = jsonString.slice(0, -3);
  }
  jsonString = jsonString.trim();

  try {
    return JSON.parse(jsonString) as T;
  } catch (error) {
    console.error('Failed to parse JSON response:', jsonString.substring(0, 200));
    throw new Error(`Failed to parse AI response as JSON: ${error}`);
  }
}
