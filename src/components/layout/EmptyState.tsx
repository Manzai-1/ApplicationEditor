import { Button } from '@/components/ui/button'
import { FileText, FilePlus } from 'lucide-react'

interface EmptyStateProps {
  onCreateTemplate: () => void
  onCreateApplication: () => void
}

function EmptyState({ onCreateTemplate, onCreateApplication }: EmptyStateProps) {
  return (
    <div className="flex h-full flex-1 items-center justify-center">
      <div className="flex flex-col items-center gap-6 text-center">
        <FileText className="h-12 w-12 text-muted-foreground/50" />
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold">Get Started</h2>
          <p className="max-w-sm text-muted-foreground">
            Create a CV template or start a new application
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={onCreateTemplate}>
            <FileText className="h-4 w-4" />
            Create Template
          </Button>
          <Button onClick={onCreateApplication}>
            <FilePlus className="h-4 w-4" />
            Create Application
          </Button>
        </div>
      </div>
    </div>
  )
}

export default EmptyState
