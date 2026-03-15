import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Plus, Trash2, ChevronUp, ChevronDown } from '@/components/icons'

interface ArrayFieldProps {
  label: string
  value: string[]
  onChange: (value: string[]) => void
  error?: string
}

function ArrayField({ label, value, onChange, error }: ArrayFieldProps) {
  const handleItemChange = (index: number, newValue: string) => {
    const updated = [...value]
    updated[index] = newValue
    onChange(updated)
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    onChange([...value, ''])
  }

  const handleMoveUp = (index: number) => {
    if (index === 0) return
    const updated = [...value]
    ;[updated[index - 1], updated[index]] = [updated[index], updated[index - 1]]
    onChange(updated)
  }

  const handleMoveDown = (index: number) => {
    if (index === value.length - 1) return
    const updated = [...value]
    ;[updated[index], updated[index + 1]] = [updated[index + 1], updated[index]]
    onChange(updated)
  }

  return (
    <div className="space-y-1.5">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="space-y-2">
        {value.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <div className="flex flex-col">
              <button
                type="button"
                onClick={() => handleMoveUp(index)}
                disabled={index === 0}
                className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronUp className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleMoveDown(index)}
                disabled={index === value.length - 1}
                className="p-0.5 text-muted-foreground hover:text-foreground disabled:opacity-30"
              >
                <ChevronDown className="w-4 h-4" />
              </button>
            </div>
            <Input
              value={item}
              onChange={(e) => handleItemChange(index, e.target.value)}
              className="flex-1"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={() => handleRemove(index)}
              className="text-muted-foreground hover:text-destructive"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAdd} className="mt-2">
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default ArrayField
