import type { ReactNode } from 'react'
import { Pencil } from '@/components/icons'

interface EditableBlockProps {
  children: ReactNode
  onEdit: () => void
}

function EditableBlock({ children, onEdit }: EditableBlockProps) {
  return (
    <div className="relative border border-border rounded-lg p-4">
      <button
        type="button"
        onClick={onEdit}
        className="absolute top-3 right-3 p-1.5 rounded hover:bg-muted transition-colors"
      >
        <Pencil className="w-4 h-4 text-muted-foreground" />
      </button>
      {children}
    </div>
  )
}

export default EditableBlock
