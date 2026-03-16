import { Fragment } from 'react'
import type { Language } from '@/types/cv'

interface LanguagesSectionProps {
  data: Language[]
}

function LanguagesSection({ data }: LanguagesSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Languages</h2>
      <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1">
        {data.map((lang) => (
          <Fragment key={lang.id}>
            <span className="font-medium text-foreground">{lang.language}</span>
            <span className="text-foreground">{lang.level}</span>
          </Fragment>
        ))}
      </div>
    </section>
  )
}

export default LanguagesSection
