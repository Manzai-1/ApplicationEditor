import { authConfig } from '@/config/auth'
import type { ProfileData, ApiResponse } from '@/types/cv'

const { apiBaseUrl } = authConfig

export async function getProfile(): Promise<ProfileData> {
  const response = await fetch(`${apiBaseUrl}/profile`, {
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to fetch profile')
  }

  const result: ApiResponse<{ content: ProfileData }> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to fetch profile')
  }

  return result.data!.content
}

export async function updateProfile(data: ProfileData): Promise<ProfileData> {
  const response = await fetch(`${apiBaseUrl}/profile`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to update profile')
  }

  const result: ApiResponse<{ content: ProfileData }> = await response.json()
  if (result.status === 'error') {
    throw new Error(result.message || 'Failed to update profile')
  }

  return result.data!.content
}
