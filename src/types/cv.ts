export interface ProfileData {
  name: string
  title: string
  email: string
  phone: { raw: string; display: string }
  location: string
  linkedin: { url: string; display: string }
  github: { url: string; display: string }
}

interface BaseComponent {
  id: string
  sortOrder: number
}

export interface About extends BaseComponent {
  text: string
}

export interface Skill extends BaseComponent {
  header: string
  items: string[]
}

export interface Language extends BaseComponent {
  language: string
  level: string
}

export interface Highlight {
  title: string
  description: string
}

export interface Experience extends BaseComponent {
  title: string
  company: string
  year: string
  description: string
  highlights: Highlight[]
}

export interface Education extends BaseComponent {
  title: string
  year: string
  highlights: Highlight[]
}

export interface Certification extends BaseComponent {
  title: string
}

export type NewAbout = Omit<About, 'id' | 'sortOrder'>
export type NewSkill = Omit<Skill, 'id' | 'sortOrder'>
export type NewLanguage = Omit<Language, 'id' | 'sortOrder'>
export type NewExperience = Omit<Experience, 'id' | 'sortOrder'>
export type NewEducation = Omit<Education, 'id' | 'sortOrder'>
export type NewCertification = Omit<Certification, 'id' | 'sortOrder'>

export interface ApiComponent<T> {
  id: string
  content: T
  sort_order: number
}

export interface ApiCV {
  id: string
  name: string
  type: number
  created_at: string
  updated_at: string
  about: ApiComponent<{ text: string }>[]
  skills: ApiComponent<{ header: string; items: string[] }>[]
  languages: ApiComponent<{ language: string; level: string }>[]
  experiences: ApiComponent<{
    title: string
    company: string
    year: string
    description: string
    highlights: Highlight[]
  }>[]
  education: ApiComponent<{
    title: string
    year: string
    highlights: Highlight[]
  }>[]
  certifications: ApiComponent<{ title: string }>[]
}

export interface CVListItem {
  id: string
  name: string
  type: number
  created_at: string
  updated_at: string
}

export interface ApiResponse<T> {
  status: 'success' | 'error'
  data?: T
  message?: string
}

export interface ComponentResponse {
  id: string
  content: Record<string, unknown>
  sort_order?: number
}
