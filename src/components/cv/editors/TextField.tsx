import { Textarea } from '@/components/ui/textarea'

interface TextFieldProps {
  label: string
  value: string
  onChange: (value: string) => void
  error?: string
}

function TextField({ label, value, onChange, error }: TextFieldProps) {
  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Textarea value={value} onChange={(e) => onChange(e.target.value)} rows={4} />
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default TextField
