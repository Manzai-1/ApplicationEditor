import { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { X } from '@/components/icons'
import { StringField, TextField, ArrayField, ObjectArrayField } from '@/components/cv/editors'
import {
  sectionConfig,
  getNestedValue,
  setNestedValue,
  type FieldConfig,
} from '@/components/cv/editors/sectionConfig'
import type {
  ProfileData,
  AboutData,
  SkillsData,
  LanguagesData,
  ExperiencesData,
  EducationData,
  CertificationsData,
} from '@/types/cv'

type SectionData =
  | ProfileData
  | AboutData
  | SkillsData
  | LanguagesData
  | ExperiencesData
  | EducationData
  | CertificationsData

interface CVEditModalProps {
  open: boolean
  onClose: () => void
  section: string
  data: SectionData
  onSave: (data: SectionData) => Promise<void>
}

const sectionTitles: Record<string, string> = {
  profile: 'Edit Profile',
  about: 'Edit About',
  skills: 'Edit Skills',
  languages: 'Edit Languages',
  experiences: 'Edit Experiences',
  education: 'Edit Education',
  certifications: 'Edit Certifications',
}

function CVEditModal({ open, onClose, section, data, onSave }: CVEditModalProps) {
  const [editedData, setEditedData] = useState<SectionData>(data)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    setEditedData(data)
    setSaveError(null)
  }, [data])

  const handleSave = async () => {
    setIsSaving(true)
    setSaveError(null)
    try {
      await onSave(editedData)
      onClose()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const handleFieldChange = (key: string, value: unknown) => {
    setEditedData((prev) => setNestedValue(prev as unknown as Record<string, unknown>, key, value) as unknown as SectionData)
  }

  const renderField = (field: FieldConfig) => {
    const value = getNestedValue(editedData as unknown as Record<string, unknown>, field.key)

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

  const title = sectionTitles[section] || 'Edit Section'
  const fields = sectionConfig[section] || []

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle>{title}</DialogTitle>
            <button
              type="button"
              onClick={onClose}
              className="p-1.5 rounded hover:bg-muted transition-colors"
              disabled={isSaving}
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto py-4 space-y-4">
          {fields.map(renderField)}
        </div>

        {saveError && (
          <p className="text-sm text-destructive px-1">{saveError}</p>
        )}

        <DialogFooter className="flex-shrink-0">
          <Button variant="outline" onClick={onClose} disabled={isSaving}>
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

export default CVEditModal
