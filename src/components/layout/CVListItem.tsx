import { cn } from '@/lib/utils'
import type { CVListItem as CVListItemType } from '@/types/cv'

interface CVListItemProps {
  cv: CVListItemType
  isSelected: boolean
  onClick: () => void
}

function CVListItem({ cv, isSelected, onClick }: CVListItemProps) {
  const formattedDate = new Date(cv.updated_at).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })

  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        'w-full rounded-md px-3 py-2 text-left transition-colors',
        isSelected
          ? 'bg-accent text-accent-foreground'
          : 'hover:bg-muted'
      )}
    >
      <p className="truncate text-sm font-medium">{cv.name}</p>
      <p className="text-xs text-muted-foreground">Updated {formattedDate}</p>
    </button>
  )
}

export default CVListItem
