import { useState } from 'react'
import { useCVData } from '@/context/CVDataContext'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/button'
import Spinner from '@/components/ui/Spinner'
import CVTypeToggle from '@/components/layout/CVTypeToggle'
import CVListItem from '@/components/layout/CVListItem'
import { Plus } from 'lucide-react'

type FilterValue = 'templates' | 'applications'

function Sidebar() {
  const { user } = useAuth()
  const {
    templates,
    applications,
    selectedCvId,
    selectCV,
    createCV,
    isListLoading,
  } = useCVData()

  const [filter, setFilter] = useState<FilterValue>('templates')

  if (!user) return null

  const cvList = filter === 'templates' ? templates : applications
  const defaultName = filter === 'templates' ? 'Untitled Template' : 'Untitled Application'
  const cvType = filter === 'templates' ? 0 : 1

  const handleCreateCV = async () => {
    const newId = await createCV(cvType as 0 | 1, defaultName)
    await selectCV(newId)
  }

  return (
    <aside className="flex h-full w-[280px] flex-col border-r bg-background">
      <div className="flex flex-col gap-3 p-4">
        <CVTypeToggle value={filter} onChange={setFilter} />
        <Button onClick={handleCreateCV} className="w-full">
          <Plus className="h-4 w-4" />
          New {filter === 'templates' ? 'Template' : 'Application'}
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto px-2 pb-4">
        {isListLoading ? (
          <div className="flex justify-center py-8">
            <Spinner size="sm" />
          </div>
        ) : cvList.length === 0 ? (
          <p className="px-2 py-4 text-center text-sm text-muted-foreground">
            No {filter} yet
          </p>
        ) : (
          <div className="flex flex-col gap-1">
            {cvList.map((cv) => (
              <CVListItem
                key={cv.id}
                cv={cv}
                isSelected={cv.id === selectedCvId}
                onClick={() => selectCV(cv.id)}
              />
            ))}
          </div>
        )}
      </div>
    </aside>
  )
}

export default Sidebar
