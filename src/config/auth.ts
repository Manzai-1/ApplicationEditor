export const authConfig = {
  otpLength: 6,
  resendCooldownSeconds: 60,
  apiBaseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:3001/api',
}
