import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import * as authService from '@/services/auth'
import { authConfig } from '@/config/auth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { OtpInput } from '@/components/ui/OtpInput'
import { siteConfig } from '@/config/site'
import type { VerifyPageState } from '@/types/auth'

function Verify() {
  const location = useLocation()
  const navigate = useNavigate()
  const state = location.state as VerifyPageState | null

  const [otp, setOtp] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)

  useEffect(() => {
    if (!state?.email || !state?.type) {
      navigate('/register', { replace: true })
    }
  }, [state, navigate])

  useEffect(() => {
    if (resendCooldown <= 0) return

    const timer = setInterval(() => {
      setResendCooldown((prev) => prev - 1)
    }, 1000)

    return () => clearInterval(timer)
  }, [resendCooldown])

  if (!state?.email || !state?.type) {
    return null
  }

  async function handleVerify(code: string) {
    setError('')
    setLoading(true)

    const { data, error: verifyError } = await supabase.auth.verifyOtp({
      email: state!.email,
      token: code,
      type: 'email',
    })

    if (verifyError) {
      setError(verifyError.message)
      setOtp('')
      setLoading(false)
      return
    }

    if (state!.type === 'recovery') {
      navigate('/reset-password', { replace: true })
      return
    }

    if (state!.type === 'email_change') {
      navigate('/settings', { replace: true })
      return
    }

    if (data.session?.access_token) {
      try {
        await authService.createSession(data.session.access_token)
      } catch {
        await supabase.auth.signOut()
        setError('Failed to establish session. Please try again.')
        setOtp('')
        setLoading(false)
        return
      }
    }

    navigate('/', { replace: true })
  }

  async function handleResend() {
    setError('')
    setResendCooldown(authConfig.resendCooldownSeconds)

    const { error: resendError } = await supabase.auth.resend({
      email: state!.email,
      type: state!.type === 'signup' ? 'signup' : 'email_change',
    })

    if (resendError) {
      setError(resendError.message)
    }
  }

  const title = state.type === 'signup'
    ? 'Verify your email'
    : state.type === 'recovery'
      ? 'Reset your password'
      : 'Verify email change'

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-primary">{siteConfig.name}</h1>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>{title}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-sm text-muted-foreground text-center">
              Enter the {authConfig.otpLength}-digit code sent to {state.email}
            </p>

            <OtpInput
              value={otp}
              onChange={setOtp}
              onComplete={handleVerify}
              disabled={loading}
              error={!!error}
            />

            {otp.length === authConfig.otpLength && (
              <Button
                onClick={() => handleVerify(otp)}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify'}
              </Button>
            )}

            {error && (
              <p className="text-sm text-destructive text-center">{error}</p>
            )}

            <div className="text-center">
              <Button
                variant="link"
                onClick={handleResend}
                disabled={resendCooldown > 0}
                className="text-sm"
              >
                {resendCooldown > 0
                  ? `Resend code in ${resendCooldown}s`
                  : 'Resend code'}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Verify
