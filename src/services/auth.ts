import { authConfig } from '@/config/auth'
import type { User } from '@/types/auth'

const { apiBaseUrl } = authConfig

export async function createSession(accessToken: string): Promise<User> {
  const response = await fetch(`${apiBaseUrl}/auth/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ accessToken }),
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to create session')
  }

  return response.json()
}

export async function logout(): Promise<void> {
  const response = await fetch(`${apiBaseUrl}/auth/logout`, {
    method: 'POST',
    credentials: 'include',
  })

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to logout')
  }
}

export async function getMe(): Promise<User | null> {
  const response = await fetch(`${apiBaseUrl}/auth/me`, {
    credentials: 'include',
  })

  if (response.status === 401) {
    return null
  }

  if (!response.ok) {
    const error = await response.json()
    throw new Error(error.message || 'Failed to get user')
  }

  return response.json()
}
