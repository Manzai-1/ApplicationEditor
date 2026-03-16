import { forwardRef, type HTMLAttributes } from 'react'
import { GripVertical } from '@/components/icons'
import { cn } from '@/lib/utils'

interface DragHandleProps extends HTMLAttributes<HTMLButtonElement> {
  isDragging?: boolean
}

const DragHandle = forwardRef<HTMLButtonElement, DragHandleProps>(
  ({ className, isDragging, ...props }, ref) => {
    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          'flex items-center justify-center p-1 text-muted-foreground hover:text-foreground touch-none',
          isDragging ? 'cursor-grabbing' : 'cursor-grab',
          className
        )}
        aria-label="Drag to reorder"
        {...props}
      >
        <GripVertical className="w-4 h-4" />
      </button>
    )
  }
)

DragHandle.displayName = 'DragHandle'

export default DragHandle
