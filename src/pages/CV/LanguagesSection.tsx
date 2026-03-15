import type { Language } from '@/types/cv'

interface LanguagesSectionProps {
  languages: Language[]
}

function LanguagesSection({ languages }: LanguagesSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Languages</h2>
      <div className="grid grid-cols-[auto_1fr] gap-x-8 gap-y-1">
        {languages.map((lang) => (
          <>
            <span key={`${lang.language}-name`} className="font-medium text-foreground">
              {lang.language}
            </span>
            <span key={`${lang.language}-level`} className="text-muted-foreground">
              {lang.level}
            </span>
          </>
        ))}
      </div>
    </section>
  )
}

export default LanguagesSection
