import { NextResponse } from 'next/server';
import { parseJsonResponse } from '@/lib/gemini';
import { PARSE_RESUME_PROMPT } from '@/lib/prompts';
import type { ResumeData } from '@/types/resume';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const rawText = formData.get('rawText') as string | null;

    let text = rawText || '';

    if (file && !rawText) {
      // Read the file as text on the server side
      const arrayBuffer = await file.arrayBuffer();

      if (file.type === 'application/pdf') {
        // Dynamic import for pdf-parse on server
        const { PDFParse } = await import('pdf-parse');
        const buffer = Buffer.from(arrayBuffer);
        const pdfParser = new PDFParse({ data: new Uint8Array(buffer) });
        const pdfData = await pdfParser.getText();
        text = pdfData.text;
      } else if (
        file.type ===
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
      ) {
        const mammoth = await import('mammoth');
        const result = await mammoth.extractRawText({ buffer: Buffer.from(arrayBuffer) });
        text = result.value;
      } else {
        return NextResponse.json(
          { error: 'Unsupported file type. Please upload PDF or DOCX.' },
          { status: 400 }
        );
      }
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json(
        { error: 'Could not extract enough text from the file. Please try a different file or paste your resume text.' },
        { status: 400 }
      );
    }

    // Send to Gemini for structured parsing
    const prompt = PARSE_RESUME_PROMPT + text;
    const resumeData = await parseJsonResponse<ResumeData>(prompt);

    return NextResponse.json({ data: resumeData });
  } catch (error) {
    console.error('Resume parse error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to parse resume' },
      { status: 500 }
    );
  }
}
