import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/ConfirmDialog'
import { ArrowLeft, Trash2, X } from '@/components/icons'
import { StringField, TextField, ArrayField, ObjectArrayField } from '@/components/cv/editors'
import {
  sectionConfig,
  sectionTitles,
  getEmptyItem,
  type FieldConfig,
} from '@/components/cv/editors/sectionConfig'

const deleteConfirmText: Record<string, { title: string; description: string }> = {
  experiences: {
    title: 'Delete Experience',
    description: 'This will permanently delete this experience and remove it from your CV.',
  },
  skills: {
    title: 'Delete Skill',
    description: 'This will permanently delete this skill category.',
  },
  education: {
    title: 'Delete Education',
    description: 'This will permanently delete this education entry.',
  },
  certifications: {
    title: 'Delete Certification',
    description: 'This will permanently delete this certification.',
  },
  languages: {
    title: 'Delete Language',
    description: 'This will permanently delete this language entry.',
  },
  about: {
    title: 'Delete About',
    description: 'This will permanently delete this about section.',
  },
}

interface CVEditDetailViewProps {
  section: string
  item: Record<string, unknown> | null
  onSave: (content: Record<string, unknown>) => Promise<void>
  onBack: () => void
  onClose: () => void
  onDelete?: () => Promise<void>
  onUnsavedChangesChange: (hasChanges: boolean) => void
}

function CVEditDetailView({
  section,
  item,
  onSave,
  onBack,
  onClose,
  onDelete,
  onUnsavedChangesChange,
}: CVEditDetailViewProps) {
  const isNew = item === null
  const initialData = item ?? getEmptyItem(section)
  const [editedContent, setEditedContent] = useState<Record<string, unknown>>(initialData)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const onUnsavedChangesChangeRef = useRef(onUnsavedChangesChange)
  onUnsavedChangesChangeRef.current = onUnsavedChangesChange

  useEffect(() => {
    const data = item ?? getEmptyItem(section)
    setEditedContent(data)
    setSaveError(null)
  }, [item, section])

  useEffect(() => {
    if (isNew) {
      const hasContent = Object.values(editedContent).some((v) => {
        if (Array.isArray(v)) return v.length > 0
        if (typeof v === 'string') return v.trim().length > 0
        return false
      })
      onUnsavedChangesChangeRef.current(hasContent)
    } else {
      const hasChanges = JSON.stringify(editedContent) !== JSON.stringify(item)
      onUnsavedChangesChangeRef.current(hasChanges)
    }
  }, [editedContent, item, isNew])

  const handleFieldChange = (key: string, value: unknown) => {
    setEditedContent((prev) => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      await onSave(editedContent)
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDeleteConfirm = async () => {
    if (!onDelete) return
    setIsDeleting(true)
    setDeleteError(null)
    try {
      await onDelete()
      setShowDeleteConfirm(false)
    } catch (err) {
      setDeleteError(err instanceof Error ? err.message : 'Failed to delete')
      setShowDeleteConfirm(false)
    } finally {
      setIsDeleting(false)
    }
  }

  const confirmText = deleteConfirmText[section] || {
    title: 'Delete Item',
    description: 'This will permanently delete this item.',
  }

  const renderField = (field: FieldConfig) => {
    const value = editedContent[field.key]

    switch (field.type) {
      case 'string':
        return (
          <StringField
            key={field.key}
            label={field.label}
            value={(value as string) || ''}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        )
      case 'text':
        return (
          <TextField
            key={field.key}
            label={field.label}
            value={(value as string) || ''}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        )
      case 'array':
        return (
          <ArrayField
            key={field.key}
            label={field.label}
            value={(value as string[]) || []}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        )
      case 'objectArray':
        return (
          <ObjectArrayField
            key={field.key}
            label={field.label}
            value={(value as Record<string, unknown>[]) || []}
            fields={field.fields || []}
            onChange={(val) => handleFieldChange(field.key, val)}
          />
        )
      default:
        return null
    }
  }

  const title = isNew
    ? sectionTitles[section]?.new || 'New Item'
    : sectionTitles[section]?.edit || 'Edit Item'
  const fields = sectionConfig[section] || []

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-3 pb-4 border-b border-border">
        <button
          type="button"
          onClick={onBack}
          disabled={isSaving}
          className="p-1.5 rounded hover:bg-muted transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h3 className="flex-1 text-lg font-semibold text-foreground">{title}</h3>
        <button
          type="button"
          onClick={onClose}
          disabled={isSaving}
          className="p-1.5 rounded hover:bg-muted transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto py-4 space-y-4">{fields.map(renderField)}</div>

      {(saveError || deleteError) && (
        <p className="text-sm text-destructive px-1">{saveError || deleteError}</p>
      )}

      <div className="flex items-center justify-between pt-4 border-t border-border">
        <div>
          {!isNew && onDelete && (
            <Button
              variant="ghost"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSaving}
              className="text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Delete
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBack} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </div>
      </div>

      <ConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        title={confirmText.title}
        description={confirmText.description}
        confirmLabel="Delete"
        onConfirm={handleDeleteConfirm}
        variant="danger"
        isLoading={isDeleting}
      />
    </div>
  )
}

export default CVEditDetailView
