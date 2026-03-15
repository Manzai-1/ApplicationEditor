import { authConfig } from '@/config/auth'
import type {
  ApiResponse,
  ApiCV,
  CVListItem,
  AboutData,
  SkillsData,
  LanguagesData,
  ExperiencesData,
  EducationData,
  CertificationsData,
  Skill,
  Language,
  Experience,
  Education,
  Certification,
} from '@/types/cv'

const { apiBaseUrl } = authConfig

type ComponentType = 'about' | 'skill' | 'language' | 'experience' | 'education' | 'certification'

export async function getCVList(): Promise<CVListItem[]> {
  const response = await fetch(`${apiBaseUrl}/cvs`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch CV list')
  }

  const result: ApiResponse<CVListItem[]> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to fetch CV list')
  }

  return result.data!
}

export async function getCV(cvId: string): Promise<ApiCV> {
  const response = await fetch(`${apiBaseUrl}/cv/${cvId}`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch CV')
  }

  const result: ApiResponse<ApiCV> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to fetch CV')
  }

  return result.data!
}

export async function updateComponent<T>(
  componentType: ComponentType,
  componentId: string,
  content: T
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/component/${componentType}/${componentId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update component')
  }

  const result: ApiResponse<unknown> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to update component')
  }
}

export async function reorderComponents(
  cvId: string,
  componentType: ComponentType,
  orderedIds: string[]
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/cv/${cvId}/reorder/${componentType}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ orderedIds }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to reorder components')
  }

  const result: ApiResponse<unknown> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to reorder components')
  }
}

export async function createComponent<T>(
  cvId: string,
  componentType: ComponentType,
  content: T
): Promise<{ id: string }> {
  const response = await fetch(`${apiBaseUrl}/cv/${cvId}/component`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ componentType, content }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create component')
  }

  const result: ApiResponse<{ id: string }> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to create component')
  }

  return result.data!
}

export async function deleteComponent(
  cvId: string,
  componentType: ComponentType,
  componentId: string
): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/cv/${cvId}/component/${componentType}/${componentId}`, {
    method: 'DELETE',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to delete component')
  }

  const result: ApiResponse<unknown> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to delete component')
  }
}

// Transform API CV to frontend data format
export function transformApiCV(apiCV: ApiCV) {
  return {
    aboutData: {
      text: apiCV.about[0]?.content.text || '',
      _id: apiCV.about[0]?.id,
    } as AboutData & { _id?: string },
    skillsData: {
      skills: apiCV.skills
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((s) => ({ ...s.content, _id: s.id })),
    } as SkillsData & { skills: (Skill & { _id: string })[] },
    languagesData: {
      languages: apiCV.languages
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((l) => ({ ...l.content, _id: l.id })),
    } as LanguagesData & { languages: (Language & { _id: string })[] },
    experiencesData: {
      experiences: apiCV.experiences
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((e) => ({ ...e.content, _id: e.id })),
    } as ExperiencesData & { experiences: (Experience & { _id: string })[] },
    educationData: {
      education: apiCV.education
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((e) => ({ ...e.content, _id: e.id })),
    } as EducationData & { education: (Education & { _id: string })[] },
    certificationsData: {
      certifications: apiCV.certifications
        .sort((a, b) => a.sort_order - b.sort_order)
        .map((c) => ({ ...c.content, _id: c.id })),
    } as CertificationsData & { certifications: (Certification & { _id: string })[] },
  }
}
