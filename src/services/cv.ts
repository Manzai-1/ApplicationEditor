import { authConfig } from '@/config/auth'
import type {
  ApiResponse,
  ApiCV,
  ApiComponent,
  CVListItem,
  ComponentResponse,
  About,
  Skill,
  Language,
  Experience,
  Education,
  Certification,
} from '@/types/cv'

const { apiBaseUrl } = authConfig

export type ComponentType = 'about' | 'skill' | 'language' | 'experience' | 'education' | 'certification'

export interface TransformedCV {
  id: string
  name: string
  type: number
  about: About[]
  skills: Skill[]
  languages: Language[]
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]
}

function transformComponent<TContent, TResult extends { id: string; sortOrder: number }>(
  component: ApiComponent<TContent>
): TResult {
  return {
    id: component.id,
    sortOrder: component.sort_order,
    ...component.content,
  } as unknown as TResult
}

export function transformApiCV(apiCV: ApiCV): TransformedCV {
  return {
    id: apiCV.id,
    name: apiCV.name,
    type: apiCV.type,
    about: apiCV.about
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => transformComponent<typeof c.content, About>(c)),
    skills: apiCV.skills
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => transformComponent<typeof c.content, Skill>(c)),
    languages: apiCV.languages
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => transformComponent<typeof c.content, Language>(c)),
    experiences: apiCV.experiences
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => transformComponent<typeof c.content, Experience>(c)),
    education: apiCV.education
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => transformComponent<typeof c.content, Education>(c)),
    certifications: apiCV.certifications
      .sort((a, b) => a.sort_order - b.sort_order)
      .map((c) => transformComponent<typeof c.content, Certification>(c)),
  }
}

export function transformComponentResponse<T extends { id: string; sortOrder: number }>(
  response: ComponentResponse,
  existingSortOrder?: number
): T {
  return {
    id: response.id,
    sortOrder: response.sort_order ?? existingSortOrder ?? 0,
    ...response.content,
  } as T
}

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
): Promise<ComponentResponse> {
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

  const result: ApiResponse<ComponentResponse> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to update component')
  }

  return result.data!
}

export async function reorderComponents(
  cvId: string,
  componentType: ComponentType,
  orderedIds: string[]
): Promise<string[]> {
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

  const result: ApiResponse<{ orderedIds: string[] }> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to reorder components')
  }

  return result.data!.orderedIds
}

export async function createComponent<T>(
  cvId: string,
  componentType: ComponentType,
  content: T
): Promise<ComponentResponse> {
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

  const result: ApiResponse<ComponentResponse> = await response.json()
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
