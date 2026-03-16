import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Check, X } from 'lucide-react'
import Spinner from '@/components/ui/Spinner'

interface CVNameHeaderProps {
  name: string
  onSave: (newName: string) => Promise<void>
}

function CVNameHeader({ name, onSave }: CVNameHeaderProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedName, setEditedName] = useState(name)
  const [isSaving, setIsSaving] = useState(false)

  const handleStartEdit = () => {
    setEditedName(name)
    setIsEditing(true)
  }

  const handleCancel = () => {
    setEditedName(name)
    setIsEditing(false)
  }

  const handleSave = async () => {
    if (!editedName.trim() || editedName === name) {
      setIsEditing(false)
      return
    }

    setIsSaving(true)
    try {
      await onSave(editedName.trim())
      setIsEditing(false)
    } finally {
      setIsSaving(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSave()
    } else if (e.key === 'Escape') {
      handleCancel()
    }
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-2">
        <Input
          value={editedName}
          onChange={(e) => setEditedName(e.target.value)}
          onKeyDown={handleKeyDown}
          className="max-w-md text-2xl font-bold"
          autoFocus
          disabled={isSaving}
        />
        <Button
          variant="ghost"
          size="icon"
          onClick={handleSave}
          disabled={isSaving}
        >
          {isSaving ? <Spinner size="sm" /> : <Check className="h-5 w-5" />}
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleCancel}
          disabled={isSaving}
        >
          <X className="h-5 w-5" />
        </Button>
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <h1 className="text-2xl font-bold">{name}</h1>
      <Button
        variant="ghost"
        size="icon"
        onClick={handleStartEdit}
        className="text-muted-foreground hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </Button>
    </div>
  )
}

export default CVNameHeader
