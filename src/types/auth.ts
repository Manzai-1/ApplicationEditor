import type { User as SupabaseUser } from '@supabase/supabase-js'

export type User = SupabaseUser

export type VerificationType = 'signup' | 'recovery' | 'email_change'

export interface VerifyPageState {
  email: string
  type: VerificationType
}
