import { NextResponse } from 'next/server';
import { generateContent, parseJsonResponse } from '@/lib/gemini';
import { OPTIMIZE_SECTION_PROMPT, OPTIMIZE_SUMMARY_PROMPT, ENHANCE_BULLETS_PROMPT } from '@/lib/prompts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { type, data, context } = body;

    if (!type || !data) {
      return NextResponse.json(
        { error: 'Missing type or data in request body' },
        { status: 400 }
      );
    }

    let result: unknown;

    switch (type) {
      case 'summary': {
        const prompt = OPTIMIZE_SUMMARY_PROMPT + JSON.stringify(data);
        const summaryText = await generateContent(prompt);
        result = { summary: summaryText.trim().replace(/^["']|["']$/g, '') };
        break;
      }

      case 'bullets': {
        const prompt = ENHANCE_BULLETS_PROMPT + JSON.stringify(data);
        result = await parseJsonResponse<string[]>(prompt);
        break;
      }

      case 'section': {
        const prompt = OPTIMIZE_SECTION_PROMPT +
          `\nSection type: ${context || 'general'}` +
          `\nData: ${JSON.stringify(data)}`;
        result = await parseJsonResponse<unknown>(prompt);
        break;
      }

      default:
        return NextResponse.json(
          { error: `Unknown optimization type: ${type}` },
          { status: 400 }
        );
    }

    return NextResponse.json({ data: result });
  } catch (error) {
    console.error('Optimize error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Optimization failed' },
      { status: 500 }
    );
  }
}
