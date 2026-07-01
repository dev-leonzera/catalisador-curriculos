export interface Experience {
  id: string;
  company: string;
  role: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
}

export interface Education {
  id: string;
  institution: string;
  degree: string;
  fieldOfStudy: string;
  startDate: string;
  endDate: string;
  current: boolean;
}

export interface Language {
  id: string;
  language: string;
  level: string; // Iniciante, Intermediário, Avançado, Fluente, Nativo
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  location: string;
  linkedin: string;
  github: string;
  website: string;
  summary: string;
  experiences: Experience[];
  education: Education[];
  skills: string[];
  languages: Language[];
}

export interface KeywordSuggestion {
  keyword: string;
  category: 'hard' | 'soft' | 'tool' | 'other';
  importance: 'high' | 'medium' | 'low';
  justification: string;
  whereToInclude: string;
}

export interface CompatibilityReport {
  score: number; // 0 to 100
  matchAnalysis: string; // Detailed human-friendly analysis
  matchingSkills: string[];
  missingSkills: string[];
  suggestedKeywords: KeywordSuggestion[];
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
}

export interface JobApplicationStage {
  id: string;
  name: string;
  date: string;
  notes?: string;
}

export interface Job {
  id: string;
  companyName: string;
  jobTitle: string;
  description: string;
  stages: JobApplicationStage[];
  createdAt: string;
}

export interface GeneratedCV {
  id: string;
  jobId?: string; // Link to the job
  jobTitle: string;
  companyName: string;
  dateGenerated: string;
  profile: UserProfile; // The tailored profile contents
  originalJobDescription: string;
  customSummary: string; // Tailored professional summary
  customExperiences: Experience[]; // Tailored job descriptions
  customSkills: string[]; // Tailored skills list including keywords
  score?: number; // Compatibilidade ATS associada
}
