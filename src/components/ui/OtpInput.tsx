import { useRef, KeyboardEvent, ClipboardEvent } from 'react'
import { Input } from '@/components/ui/input'
import { authConfig } from '@/config/auth'
import { cn } from '@/lib/utils'

interface OtpInputProps {
  value: string
  onChange: (value: string) => void
  onComplete: (value: string) => void
  disabled?: boolean
  error?: boolean
}

export function OtpInput({ value, onChange, onComplete, disabled, error }: OtpInputProps) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const { otpLength } = authConfig

  const digits = Array.from({ length: otpLength }, (_, i) => value[i] || '')

  function focusInput(index: number) {
    inputRefs.current[index]?.focus()
  }

  function handleChange(index: number, inputValue: string) {
    const digit = inputValue.slice(-1)
    if (digit && !/^\d$/.test(digit)) return

    const newDigits = [...digits]
    newDigits[index] = digit
    const newValue = newDigits.join('')
    onChange(newValue)

    if (digit && index < otpLength - 1) {
      focusInput(index + 1)
    }

    if (newValue.length === otpLength && !newValue.includes('')) {
      onComplete(newValue)
    }
  }

  function handleKeyDown(index: number, e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (!digits[index] && index > 0) {
        focusInput(index - 1)
      }
    }

    if (e.key === 'ArrowLeft' && index > 0) {
      focusInput(index - 1)
    }

    if (e.key === 'ArrowRight' && index < otpLength - 1) {
      focusInput(index + 1)
    }
  }

  function handlePaste(e: ClipboardEvent<HTMLInputElement>) {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, otpLength)
    if (!pastedData) return

    onChange(pastedData)
    focusInput(Math.min(pastedData.length, otpLength - 1))

    if (pastedData.length === otpLength) {
      onComplete(pastedData)
    }
  }

  return (
    <div className="flex gap-2 justify-center">
      {digits.map((digit, index) => (
        <Input
          key={index}
          ref={(el) => { inputRefs.current[index] = el }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onPaste={handlePaste}
          disabled={disabled}
          className={cn(
            'w-12 h-14 text-center text-2xl font-semibold',
            error && 'border-destructive focus-visible:ring-destructive'
          )}
          autoFocus={index === 0}
        />
      ))}
    </div>
  )
}
