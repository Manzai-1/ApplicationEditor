import { Input } from '@/components/ui/input'

interface StringFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function StringField({ label, value, onChange, error }: StringFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Input value={value} onChange={(e) => onChange(e.target.value)} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default StringField
