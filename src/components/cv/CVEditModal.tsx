import { useState, useEffect, useCallback } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { X } from '@/components/icons'
import { useCVData } from '@/context/CVDataContext'
import CVEditListView from '@/components/cv/CVEditListView'
import CVEditDetailView from '@/components/cv/CVEditDetailView'
import { sectionTitles, getNestedValue, setNestedValue } from '@/components/cv/editors/sectionConfig'
import { StringField, TextField, ArrayField, ObjectArrayField } from '@/components/cv/editors'
import { sectionConfig, type FieldConfig } from '@/components/cv/editors/sectionConfig'
import { Button } from '@/components/ui/button'
import type {
  ProfileData,
  About,
  Skill,
  Language,
  Experience,
  Education,
  Certification,
  NewAbout,
  NewSkill,
  NewLanguage,
  NewExperience,
  NewEducation,
  NewCertification,
} from '@/types/cv'

type SectionItem = About | Skill | Language | Experience | Education | Certification
type SectionData = ProfileData | SectionItem[]

interface CVEditModalProps {
  open: boolean
  onClose: () => void
  section: string
  data: SectionData
}

const arraySections = ['about', 'skills', 'languages', 'experiences', 'education', 'certifications']

function CVEditModal({ open, onClose, section, data }: CVEditModalProps) {
  const ctx = useCVData()
  const isArraySection = arraySections.includes(section)

  const [view, setView] = useState<'list' | 'detail'>('list')
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null)
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false)

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [isSaving, setIsSaving] = useState(false)
  const [saveError, setSaveError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      if (section === 'profile') {
        setView('detail')
        setProfileData(data as ProfileData)
      } else {
        setView('list')
      }
      setSelectedItemId(null)
      setHasUnsavedChanges(false)
      setSaveError(null)
    }
  }, [open, section, data])

  const handleClose = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to close?')
      if (!confirmed) return
    }
    onClose()
  }, [hasUnsavedChanges, onClose])

  const handleSelectItem = (id: string) => {
    setSelectedItemId(id)
    setView('detail')
  }

  const handleAddNew = () => {
    setSelectedItemId(null)
    setView('detail')
  }

  const handleBackToList = useCallback(() => {
    if (hasUnsavedChanges) {
      const confirmed = window.confirm('You have unsaved changes. Are you sure you want to go back?')
      if (!confirmed) return
    }
    setView('list')
    setSelectedItemId(null)
    setHasUnsavedChanges(false)
  }, [hasUnsavedChanges])

  const getSelectedItem = (): Record<string, unknown> | null => {
    if (!isArraySection || selectedItemId === null) return null
    const items = data as SectionItem[]
    const item = items.find((i) => i.id === selectedItemId)
    if (!item) return null
    const { id: _id, sortOrder: _sortOrder, ...content } = item
    return content
  }

  const handleSaveItem = async (content: Record<string, unknown>) => {
    const isNew = selectedItemId === null

    switch (section) {
      case 'about':
        if (isNew) {
          await ctx.createAbout(content as NewAbout)
        } else {
          await ctx.updateAbout(selectedItemId, content as Omit<About, 'id' | 'sortOrder'>)
        }
        break
      case 'skills':
        if (isNew) {
          await ctx.createSkill(content as NewSkill)
        } else {
          await ctx.updateSkill(selectedItemId, content as Omit<Skill, 'id' | 'sortOrder'>)
        }
        break
      case 'languages':
        if (isNew) {
          await ctx.createLanguage(content as NewLanguage)
        } else {
          await ctx.updateLanguage(selectedItemId, content as Omit<Language, 'id' | 'sortOrder'>)
        }
        break
      case 'experiences':
        if (isNew) {
          await ctx.createExperience(content as NewExperience)
        } else {
          await ctx.updateExperience(selectedItemId, content as Omit<Experience, 'id' | 'sortOrder'>)
        }
        break
      case 'education':
        if (isNew) {
          await ctx.createEducation(content as NewEducation)
        } else {
          await ctx.updateEducation(selectedItemId, content as Omit<Education, 'id' | 'sortOrder'>)
        }
        break
      case 'certifications':
        if (isNew) {
          await ctx.createCertification(content as NewCertification)
        } else {
          await ctx.updateCertification(
            selectedItemId,
            content as Omit<Certification, 'id' | 'sortOrder'>
          )
        }
        break
    }

    setHasUnsavedChanges(false)
    setView('list')
    setSelectedItemId(null)
  }

  const handleDeleteItem = async () => {
    if (selectedItemId === null) return

    switch (section) {
      case 'about':
        await ctx.deleteAbout(selectedItemId)
        break
      case 'skills':
        await ctx.deleteSkill(selectedItemId)
        break
      case 'languages':
        await ctx.deleteLanguage(selectedItemId)
        break
      case 'experiences':
        await ctx.deleteExperience(selectedItemId)
        break
      case 'education':
        await ctx.deleteEducation(selectedItemId)
        break
      case 'certifications':
        await ctx.deleteCertification(selectedItemId)
        break
    }

    setHasUnsavedChanges(false)
    setView('list')
    setSelectedItemId(null)
  }

  const handleProfileFieldChange = (key: string, value: unknown) => {
    setProfileData(
      (prev) =>
        setNestedValue(prev as unknown as Record<string, unknown>, key, value) as unknown as ProfileData
    )
    setHasUnsavedChanges(true)
  }

  const handleProfileSave = async () => {
    if (!profileData) return
    setIsSaving(true)
    setSaveError(null)
    try {
      await ctx.updateProfile(profileData)
      setHasUnsavedChanges(false)
      onClose()
    } catch (err) {
      setSaveError(err instanceof Error ? err.message : 'Failed to save')
    } finally {
      setIsSaving(false)
    }
  }

  const renderProfileField = (field: FieldConfig) => {
    if (!profileData) return null
    const value = getNestedValue(profileData as unknown as Record<string, unknown>, field.key)

    switch (field.type) {
      case 'string':
        return (
          <StringField
            key={field.key}
            label={field.label}
            value={(value as string) || ''}
            onChange={(val) => handleProfileFieldChange(field.key, val)}
          />
        )
      case 'text':
        return (
          <TextField
            key={field.key}
            label={field.label}
            value={(value as string) || ''}
            onChange={(val) => handleProfileFieldChange(field.key, val)}
          />
        )
      case 'array':
        return (
          <ArrayField
            key={field.key}
            label={field.label}
            value={(value as string[]) || []}
            onChange={(val) => handleProfileFieldChange(field.key, val)}
          />
        )
      case 'objectArray':
        return (
          <ObjectArrayField
            key={field.key}
            label={field.label}
            value={(value as Record<string, unknown>[]) || []}
            fields={field.fields || []}
            onChange={(val) => handleProfileFieldChange(field.key, val)}
          />
        )
      default:
        return null
    }
  }

  const renderContent = () => {
    if (section === 'profile') {
      const fields = sectionConfig.profile || []
      return (
        <div className="flex flex-col h-full">
          <div className="flex-1 overflow-y-auto py-4 space-y-4">
            {fields.map(renderProfileField)}
          </div>

          {saveError && <p className="text-sm text-destructive px-1">{saveError}</p>}

          <div className="flex justify-end gap-2 pt-4 border-t border-border">
            <Button variant="outline" onClick={handleClose} disabled={isSaving}>
              Cancel
            </Button>
            <Button onClick={handleProfileSave} disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save'}
            </Button>
          </div>
        </div>
      )
    }

    if (view === 'list') {
      return (
        <CVEditListView
          section={section}
          items={data as SectionItem[]}
          onSelectItem={handleSelectItem}
          onAddNew={handleAddNew}
        />
      )
    }

    return (
      <CVEditDetailView
        section={section}
        item={getSelectedItem()}
        onSave={handleSaveItem}
        onBack={handleBackToList}
        onClose={handleClose}
        onDelete={selectedItemId ? handleDeleteItem : undefined}
        onUnsavedChangesChange={setHasUnsavedChanges}
      />
    )
  }

  const getTitle = () => {
    if (section === 'profile') {
      return sectionTitles.profile.edit
    }
    if (view === 'list') {
      return sectionTitles[section]?.list || 'Edit Section'
    }
    return selectedItemId
      ? sectionTitles[section]?.edit || 'Edit Item'
      : sectionTitles[section]?.new || 'New Item'
  }

  const showModalHeader = section === 'profile' || view === 'list'

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="max-w-2xl max-h-[85vh] flex flex-col">
        {showModalHeader && (
          <DialogHeader className="flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle>{getTitle()}</DialogTitle>
              <button
                type="button"
                onClick={handleClose}
                className="p-1.5 rounded hover:bg-muted transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </DialogHeader>
        )}

        <div className="flex-1 overflow-y-auto min-h-0">{renderContent()}</div>
      </DialogContent>
    </Dialog>
  )
}

export default CVEditModal
