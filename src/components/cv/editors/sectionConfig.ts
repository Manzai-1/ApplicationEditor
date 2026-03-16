export interface FieldConfig {
  key: string
  label: string
  type: 'string' | 'text' | 'array' | 'objectArray'
  fields?: FieldConfig[]
}

export type SectionConfig = Record<string, FieldConfig[]>

export const sectionConfig: SectionConfig = {
  profile: [
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'email', label: 'Email', type: 'string' },
    { key: 'phone.display', label: 'Phone', type: 'string' },
    { key: 'location', label: 'Location', type: 'string' },
    { key: 'linkedin.url', label: 'LinkedIn URL', type: 'string' },
    { key: 'github.url', label: 'GitHub URL', type: 'string' },
  ],
  about: [{ key: 'text', label: 'About', type: 'text' }],
  skills: [
    { key: 'header', label: 'Category', type: 'string' },
    { key: 'items', label: 'Skills', type: 'array' },
  ],
  languages: [
    { key: 'language', label: 'Language', type: 'string' },
    { key: 'level', label: 'Level', type: 'string' },
  ],
  experiences: [
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'company', label: 'Company', type: 'string' },
    { key: 'year', label: 'Year', type: 'string' },
    { key: 'description', label: 'Description', type: 'text' },
    {
      key: 'highlights',
      label: 'Highlights',
      type: 'objectArray',
      fields: [
        { key: 'title', label: 'Title', type: 'string' },
        { key: 'description', label: 'Description', type: 'text' },
      ],
    },
  ],
  education: [
    { key: 'title', label: 'Title', type: 'string' },
    { key: 'year', label: 'Year', type: 'string' },
    {
      key: 'highlights',
      label: 'Highlights',
      type: 'objectArray',
      fields: [
        { key: 'title', label: 'Title', type: 'string' },
        { key: 'description', label: 'Description', type: 'text' },
      ],
    },
  ],
  certifications: [{ key: 'title', label: 'Title', type: 'string' }],
}

export const sectionTitles: Record<string, { list: string; edit: string; new: string }> = {
  profile: { list: 'Profile', edit: 'Edit Profile', new: 'Edit Profile' },
  about: { list: 'About', edit: 'Edit About', new: 'New About' },
  skills: { list: 'Skills', edit: 'Edit Skill', new: 'New Skill' },
  languages: { list: 'Languages', edit: 'Edit Language', new: 'New Language' },
  experiences: { list: 'Experiences', edit: 'Edit Experience', new: 'New Experience' },
  education: { list: 'Education', edit: 'Edit Education', new: 'New Education' },
  certifications: { list: 'Certifications', edit: 'Edit Certification', new: 'New Certification' },
}

export function getEmptyItem(section: string): Record<string, unknown> {
  const fields = sectionConfig[section] || []
  const item: Record<string, unknown> = {}
  fields.forEach((field) => {
    if (field.type === 'array' || field.type === 'objectArray') {
      item[field.key] = []
    } else {
      item[field.key] = ''
    }
  })
  return item
}

export function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  return path.split('.').reduce((acc, key) => {
    if (acc && typeof acc === 'object') {
      return (acc as Record<string, unknown>)[key]
    }
    return undefined
  }, obj as unknown)
}

export function setNestedValue(
  obj: Record<string, unknown>,
  path: string,
  value: unknown
): Record<string, unknown> {
  const keys = path.split('.')
  const result = { ...obj }

  let current: Record<string, unknown> = result
  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i]
    current[key] = { ...(current[key] as Record<string, unknown>) }
    current = current[key] as Record<string, unknown>
  }

  current[keys[keys.length - 1]] = value
  return result
}
