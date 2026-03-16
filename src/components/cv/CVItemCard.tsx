import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Pencil } from '@/components/icons'
import DragHandle from '@/components/ui/DragHandle'
import type { About, Skill, Language, Experience, Education, Certification } from '@/types/cv'

type SectionItem = About | Skill | Language | Experience | Education | Certification

interface CVItemCardProps {
  item: SectionItem
  section: string
  onClick: () => void
}

function getItemSummary(item: SectionItem, section: string): { primary: string; secondary?: string } {
  switch (section) {
    case 'about':
      return {
        primary: (item as About).text.slice(0, 80) + ((item as About).text.length > 80 ? '...' : ''),
      }
    case 'skills': {
      const skill = item as Skill
      return {
        primary: skill.header,
        secondary: `${skill.items.length} skill${skill.items.length !== 1 ? 's' : ''}`,
      }
    }
    case 'languages': {
      const lang = item as Language
      return {
        primary: lang.language,
        secondary: lang.level,
      }
    }
    case 'experiences': {
      const exp = item as Experience
      return {
        primary: exp.title,
        secondary: `${exp.company} - ${exp.year}${exp.highlights.length > 0 ? ` - ${exp.highlights.length} highlight${exp.highlights.length !== 1 ? 's' : ''}` : ''}`,
      }
    }
    case 'education': {
      const edu = item as Education
      return {
        primary: edu.title,
        secondary: edu.year,
      }
    }
    case 'certifications':
      return {
        primary: (item as Certification).title,
      }
    default:
      return { primary: 'Unknown item' }
  }
}

function CVItemCard({ item, section, onClick }: CVItemCardProps) {
  const summary = getItemSummary(item, section)

  const {
    attributes,
    listeners,
    setNodeRef,
    setActivatorNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center gap-2 p-4 border border-border rounded-lg bg-background transition-shadow ${
        isDragging ? 'shadow-lg opacity-50' : ''
      }`}
    >
      <DragHandle
        ref={setActivatorNodeRef}
        isDragging={isDragging}
        {...attributes}
        {...listeners}
      />
      <button
        type="button"
        onClick={onClick}
        className="flex-1 flex items-center justify-between gap-4 hover:bg-muted/50 rounded-md -my-2 py-2 -mr-2 pr-2 transition-colors cursor-pointer text-left"
      >
        <div className="flex-1 min-w-0">
          <p className="font-medium text-foreground truncate">{summary.primary}</p>
          {summary.secondary && (
            <p className="text-sm text-muted-foreground truncate">{summary.secondary}</p>
          )}
        </div>
        <Pencil className="w-4 h-4 text-muted-foreground flex-shrink-0" />
      </button>
    </div>
  )
}

export default CVItemCard
