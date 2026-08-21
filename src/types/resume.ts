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

export type TemplateName = 'classic' | 'modern' | 'minimal' | 'professional' | 'creative';

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
