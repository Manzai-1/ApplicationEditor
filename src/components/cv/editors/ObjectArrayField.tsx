import { Button } from '@/components/ui/button'
import { Plus, Trash2, ChevronUp, ChevronDown } from '@/components/icons'
import StringField from './StringField'
import TextField from './TextField'
import ArrayField from './ArrayField'
import type { FieldConfig } from './sectionConfig'

interface ObjectArrayFieldProps {
  label: string
  value: Record<string, unknown>[]
  fields: FieldConfig[]
  onChange: (value: Record<string, unknown>[]) => void
  error?: string
}

function ObjectArrayField({ label, value, fields, onChange, error }: ObjectArrayFieldProps) {
  const handleFieldChange = (index: number, key: string, newValue: unknown) => {
    const updated = [...value]
    updated[index] = { ...updated[index], [key]: newValue }
    onChange(updated)
  }

  const handleRemove = (index: number) => {
    onChange(value.filter((_, i) => i !== index))
  }

  const handleAdd = () => {
    const newItem: Record<string, unknown> = {}
    fields.forEach((field) => {
      if (field.type === 'array' || field.type === 'objectArray') {
        newItem[field.key] = []
      } else {
        newItem[field.key] = ''
      }
    })
    onChange([...value, newItem])
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

  const renderField = (item: Record<string, unknown>, index: number, field: FieldConfig) => {
    const fieldValue = item[field.key]

    switch (field.type) {
      case 'string':
        return (
          <StringField
            key={field.key}
            label={field.label}
            value={(fieldValue as string) || ''}
            onChange={(val) => handleFieldChange(index, field.key, val)}
          />
        )
      case 'text':
        return (
          <TextField
            key={field.key}
            label={field.label}
            value={(fieldValue as string) || ''}
            onChange={(val) => handleFieldChange(index, field.key, val)}
          />
        )
      case 'array':
        return (
          <ArrayField
            key={field.key}
            label={field.label}
            value={(fieldValue as string[]) || []}
            onChange={(val) => handleFieldChange(index, field.key, val)}
          />
        )
      case 'objectArray':
        return (
          <ObjectArrayField
            key={field.key}
            label={field.label}
            value={(fieldValue as Record<string, unknown>[]) || []}
            fields={field.fields || []}
            onChange={(val) => handleFieldChange(index, field.key, val)}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium text-foreground">{label}</label>
      <div className="space-y-4">
        {value.map((item, index) => (
          <div key={index} className="border border-border rounded-lg p-4">
            <div className="flex items-start gap-2 mb-3">
              <div className="flex flex-col pt-1">
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
              <div className="flex-1 space-y-3">
                {fields.map((field) => renderField(item, index, field))}
              </div>
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
          </div>
        ))}
      </div>
      <Button type="button" variant="outline" size="sm" onClick={handleAdd}>
        <Plus className="w-4 h-4 mr-1" />
        Add
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  )
}

export default ObjectArrayField
