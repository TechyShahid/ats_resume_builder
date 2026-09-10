export interface PersonalInfo {
  fullName: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  portfolio: string;
  title: string;
}

export interface WorkExperience {
  id: string;
  company: string;
  position: string;
  location: string;
  startDate: string;
  endDate: string;
  current: boolean;
  bullets: string[];
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  field: string;
  location: string;
  startDate: string;
  endDate: string;
  gpa: string;
  achievements: string[];
}

export interface Skill {
  id: string;
  name: string;
  category: 'technical' | 'soft' | 'tools' | 'languages' | 'other';
}

export interface Certification {
  id: string;
  name: string;
  issuer: string;
  date: string;
  url: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  techStack: string[];
  url: string;
  bullets: string[];
}

export interface ResumeData {
  personalInfo: PersonalInfo;
  summary: string;
  experience: WorkExperience[];
  education: Education[];
  skills: Skill[];
  certifications: Certification[];
  projects: Project[];
}

export type TemplateName =
  | 'classic'
  | 'modern'
  | 'minimal'
  | 'professional'
  | 'creative'
  | 'executive'
  | 'tech'
  | 'nordic'
  | 'compact'
  | 'elegant';

export interface TemplateInfo {
  id: TemplateName;
  name: string;
  description: string;
  bestFor: string;
  accentColor: string;
}

export type BuilderStep = 'upload' | 'edit' | 'template' | 'download';

export const TEMPLATE_LIST: TemplateInfo[] = [
  {
    id: 'classic',
    name: 'Classic',
    description: 'Traditional, formal layout with timeless typography',
    bestFor: 'Legal, Finance, Government',
    accentColor: '#1a1a2e',
  },
  {
    id: 'modern',
    name: 'Modern',
    description: 'Clean sans-serif with vibrant accent colors',
    bestFor: 'Tech, Marketing, Startups',
    accentColor: '#6366f1',
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Ultra-clean, whitespace-focused design',
    bestFor: 'Design, Consulting, Executive',
    accentColor: '#374151',
  },
  {
    id: 'professional',
    name: 'Professional',
    description: 'Two-column with skills sidebar and navy accents',
    bestFor: 'Engineering, Management, Corporate',
    accentColor: '#1e3a5f',
  },
  {
    id: 'creative',
    name: 'Creative',
    description: 'Bold headers with dynamic color blocks',
    bestFor: 'Marketing, UX, Creative roles',
    accentColor: '#ec4899',
  },
  {
    id: 'executive',
    name: 'Executive',
    description: 'Authoritative serif layout with gold accents and core competencies',
    bestFor: 'C-Suite, VP, Directors & Leaders',
    accentColor: '#b8860b',
  },
  {
    id: 'tech',
    name: 'Tech / Dev',
    description: 'Clean engineering layout with tech tags and skill category pills',
    bestFor: 'Software, DevOps, Data Science',
    accentColor: '#059669',
  },
  {
    id: 'nordic',
    name: 'Nordic',
    description: 'Scandinavian minimalist styling with sleek slate typography',
    bestFor: 'Product, UX, Strategy, Analytics',
    accentColor: '#475569',
  },
  {
    id: 'compact',
    name: 'Compact',
    description: 'High-density dual column design for packing 10+ years of experience',
    bestFor: 'Senior Professionals & Operations',
    accentColor: '#2563eb',
  },
  {
    id: 'elegant',
    name: 'Elegant',
    description: 'Classical Ivy League style with deep wine accents and diamond bullets',
    bestFor: 'Academic, Research, Law, Advisory',
    accentColor: '#881337',
  },
];

export type ResumeFontFamily =
  | 'default'
  | 'inter'
  | 'roboto'
  | 'arial'
  | 'georgia'
  | 'garamond'
  | 'merriweather'
  | 'courier';

export type ResumeFontSize = 'small' | 'standard' | 'medium' | 'large';

export interface ResumeFontConfig {
  id: ResumeFontFamily;
  name: string;
  category: 'Default' | 'Sans-Serif' | 'Serif' | 'Monospace';
  fontFamily: string;
}

export const RESUME_FONTS: ResumeFontConfig[] = [
  { id: 'default', name: 'Template Default', category: 'Default', fontFamily: 'inherit' },
  { id: 'inter', name: 'Inter (Modern)', category: 'Sans-Serif', fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif" },
  { id: 'roboto', name: 'Roboto (Clean)', category: 'Sans-Serif', fontFamily: "'Roboto', -apple-system, sans-serif" },
  { id: 'arial', name: 'Arial / Helvetica', category: 'Sans-Serif', fontFamily: "Arial, 'Helvetica Neue', Helvetica, sans-serif" },
  { id: 'georgia', name: 'Georgia (Serif)', category: 'Serif', fontFamily: "Georgia, 'Times New Roman', serif" },
  { id: 'garamond', name: 'Garamond (Classic)', category: 'Serif', fontFamily: "Garamond, 'Baskerville', 'Times New Roman', serif" },
  { id: 'merriweather', name: 'Merriweather', category: 'Serif', fontFamily: "'Merriweather', Georgia, serif" },
  { id: 'courier', name: 'Courier / Mono', category: 'Monospace', fontFamily: "'Courier New', Courier, monospace" },
];

export interface ResumeFontSizeConfig {
  id: ResumeFontSize;
  name: string;
  sizePt: string;
  scale: number;
}

export const RESUME_FONT_SIZES: ResumeFontSizeConfig[] = [
  { id: 'small', name: 'Small (8pt)', sizePt: '8pt', scale: 0.93 },
  { id: 'standard', name: 'Standard (8.5pt)', sizePt: '8.5pt', scale: 1.0 },
  { id: 'medium', name: 'Medium (9pt)', sizePt: '9pt', scale: 1.07 },
  { id: 'large', name: 'Large (9.5pt)', sizePt: '9.5pt', scale: 1.14 },
];

export const EMPTY_RESUME: ResumeData = {
  personalInfo: {
    fullName: '',
    email: '',
    phone: '',
    location: '',
    linkedin: '',
    portfolio: '',
    title: '',
  },
  summary: '',
  experience: [],
  education: [],
  skills: [],
  certifications: [],
  projects: [],
};

export function generateId(): string {
  return Math.random().toString(36).substring(2, 11);
}
