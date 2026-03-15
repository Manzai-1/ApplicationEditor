export interface UserProfile {
  name: string
  title: string
  email: string
  phone: { raw: string; display: string }
  location: string
  linkedin: { url: string; display: string }
  github: { url: string; display: string }
}

export interface Highlight {
  title: string
  description: string
}

export interface Skill {
  header: string
  items: string[]
}

export interface Experience {
  title: string
  company: string
  year: string
  description: string
  highlights: Highlight[]
}

export interface Education {
  title: string
  year: string
  highlights: Highlight[]
}

export interface Language {
  language: string
  level: string
}

export interface Certification {
  title: string
}

export interface CV {
  aboutText: string
  skills: Skill[]
  experiences: Experience[]
  education: Education[]
  languages: Language[]
  certifications: Certification[]
}
