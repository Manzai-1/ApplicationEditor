import { useState, useCallback } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { Plus } from '@/components/icons'
import CVItemCard from '@/components/cv/CVItemCard'
import { sectionTitles } from '@/components/cv/editors/sectionConfig'
import { useCVData } from '@/context/CVDataContext'
import type { About, Skill, Language, Experience, Education, Certification } from '@/types/cv'

type SectionItem = About | Skill | Language | Experience | Education | Certification

interface CVEditListViewProps {
  section: string
  items: SectionItem[]
  onSelectItem: (id: string) => void
  onAddNew: () => void
}

function CVEditListView({ section, items, onSelectItem, onAddNew }: CVEditListViewProps) {
  const title = sectionTitles[section]?.list || 'Items'
  const [reorderError, setReorderError] = useState<string | null>(null)

  const {
    reorderAbout,
    reorderSkills,
    reorderLanguages,
    reorderExperiences,
    reorderEducation,
    reorderCertifications,
  } = useCVData()

  const reorderFunctions: Record<string, (orderedIds: string[]) => Promise<void>> = {
    about: reorderAbout,
    skills: reorderSkills,
    languages: reorderLanguages,
    experiences: reorderExperiences,
    education: reorderEducation,
    certifications: reorderCertifications,
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  const handleDragEnd = useCallback(
    async (event: DragEndEvent) => {
      const { active, over } = event

      if (!over || active.id === over.id) return

      const oldIndex = items.findIndex((item) => item.id === active.id)
      const newIndex = items.findIndex((item) => item.id === over.id)

      if (oldIndex === -1 || newIndex === -1) return

      const newOrder = [...items]
      const [movedItem] = newOrder.splice(oldIndex, 1)
      newOrder.splice(newIndex, 0, movedItem)

      const orderedIds = newOrder.map((item) => item.id)
      const reorderFn = reorderFunctions[section]

      if (!reorderFn) return

      try {
        setReorderError(null)
        await reorderFn(orderedIds)
      } catch {
        setReorderError('Failed to save new order. Please try again.')
        setTimeout(() => setReorderError(null), 3000)
      }
    },
    [items, section, reorderFunctions]
  )

  const itemIds = items.map((item) => item.id)

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>

      {reorderError && (
        <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
          {reorderError}
        </div>
      )}

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext items={itemIds} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <CVItemCard
                key={item.id}
                item={item}
                section={section}
                onClick={() => onSelectItem(item.id)}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <button
        type="button"
        onClick={onAddNew}
        className="w-full flex items-center justify-center gap-2 p-4 border-2 border-dashed border-border rounded-lg hover:border-foreground/30 hover:bg-muted/30 transition-colors cursor-pointer text-muted-foreground hover:text-foreground"
      >
        <Plus className="w-4 h-4" />
        <span>Add new</span>
      </button>
    </div>
  )
}

export default CVEditListView
