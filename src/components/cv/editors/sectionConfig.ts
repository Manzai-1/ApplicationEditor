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
    {
      key: 'skills',
      label: 'Skills',
      type: 'objectArray',
      fields: [
        { key: 'header', label: 'Category', type: 'string' },
        { key: 'items', label: 'Skills', type: 'array' },
      ],
    },
  ],
  languages: [
    {
      key: 'languages',
      label: 'Languages',
      type: 'objectArray',
      fields: [
        { key: 'language', label: 'Language', type: 'string' },
        { key: 'level', label: 'Level', type: 'string' },
      ],
    },
  ],
  experiences: [
    {
      key: 'experiences',
      label: 'Experiences',
      type: 'objectArray',
      fields: [
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
    },
  ],
  education: [
    {
      key: 'education',
      label: 'Education',
      type: 'objectArray',
      fields: [
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
    },
  ],
  certifications: [
    {
      key: 'certifications',
      label: 'Certifications',
      type: 'objectArray',
      fields: [{ key: 'title', label: 'Title', type: 'string' }],
    },
  ],
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
