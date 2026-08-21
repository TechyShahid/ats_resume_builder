import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { resumeData, template } = body;

    if (!resumeData) {
      return NextResponse.json(
        { error: 'Missing resume data' },
        { status: 400 }
      );
    }

    // We'll generate PDF on the client side using @react-pdf/renderer
    // This route serves as a fallback / server-side generation option
    // For now, return the data formatted for the client-side PDF generator
    return NextResponse.json({
      data: resumeData,
      template: template || 'modern',
      message: 'Use client-side PDF generation with @react-pdf/renderer',
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'PDF generation failed' },
      { status: 500 }
    );
  }
}
