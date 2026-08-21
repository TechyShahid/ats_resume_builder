const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  'application/pdf',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // .docx
];

export function validateFile(file: File): { valid: boolean; error?: string } {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a PDF or DOCX file.',
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File is too large. Maximum size is 10MB.',
    };
  }

  if (file.size === 0) {
    return {
      valid: false,
      error: 'File is empty. Please upload a valid resume file.',
    };
  }

  return { valid: true };
}

export function validateResumeData(data: Record<string, unknown>): { valid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!data.personalInfo || typeof data.personalInfo !== 'object') {
    errors.push('Personal information is required');
  } else {
    const info = data.personalInfo as Record<string, unknown>;
    if (!info.fullName || typeof info.fullName !== 'string' || info.fullName.trim() === '') {
      errors.push('Full name is required');
    }
    if (!info.email || typeof info.email !== 'string' || !info.email.includes('@')) {
      errors.push('Valid email is required');
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
