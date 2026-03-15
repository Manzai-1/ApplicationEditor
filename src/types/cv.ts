export interface ProfileData {
  name: string
  title: string
  email: string
  phone: { raw: string; display: string }
  location: string
  linkedin: { url: string; display: string }
  github: { url: string; display: string }
}

export interface AboutData {
  text: string
}

export interface Skill {
  header: string
  items: string[]
}

export interface SkillsData {
  skills: Skill[]
}

export interface Language {
  language: string
  level: string
}

export interface LanguagesData {
  languages: Language[]
}

export interface Highlight {
  title: string
  description: string
}

export interface Experience {
  title: string
  company: string
  year: string
  description: string
  highlights: Highlight[]
}

export interface ExperiencesData {
  experiences: Experience[]
}

export interface Education {
  title: string
  year: string
  highlights: Highlight[]
}

export interface EducationData {
  education: Education[]
}

export interface Certification {
  title: string
}

export interface CertificationsData {
  certifications: Certification[]
}

// API Response Types
export interface CVListItem {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface ApiComponent<T> {
  id: string
  content: T
  sort_order: number
}

export interface ApiCV {
  id: string
  name: string
  about: ApiComponent<{ text: string }>[]
  skills: ApiComponent<Skill>[]
  languages: ApiComponent<Language>[]
  experiences: ApiComponent<Experience>[]
  education: ApiComponent<Education>[]
  certifications: ApiComponent<Certification>[]
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message?: string
}
