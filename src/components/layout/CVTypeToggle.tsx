import { cn } from '@/lib/utils'

type FilterValue = 'templates' | 'applications'

interface CVTypeToggleProps {
  value: FilterValue
  onChange: (value: FilterValue) => void
}

function CVTypeToggle({ value, onChange }: CVTypeToggleProps) {
  return (
    <div className="flex w-full rounded-lg bg-muted p-1">
      <button
        type="button"
        onClick={() => onChange('templates')}
        className={cn(
          'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          value === 'templates'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Templates
      </button>
      <button
        type="button"
        onClick={() => onChange('applications')}
        className={cn(
          'flex-1 rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
          value === 'applications'
            ? 'bg-background text-foreground shadow-sm'
            : 'text-muted-foreground hover:text-foreground'
        )}
      >
        Applications
      </button>
    </div>
  )
}

export default CVTypeToggle
