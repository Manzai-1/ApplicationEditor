import type { Education } from '@/types/cv'

interface EducationSectionProps {
  data: Education[]
}

function EducationSection({ data }: EducationSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-4">Education</h2>
      <div className="space-y-6">
        {data.map((edu) => (
          <div key={edu.id} className="grid grid-cols-[120px_1fr] gap-x-3">
            <span className="text-sm font-medium text-foreground">{edu.year}</span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">{edu.title}</h3>
              {edu.highlights.length > 0 && (
                <div className="ml-4 border-l-2 border-border pl-4 mt-3 space-y-3">
                  {edu.highlights.map((highlight) => (
                    <div key={highlight.title}>
                      <p className="font-bold text-foreground mb-0.5">{highlight.title}</p>
                      <p className="text-foreground leading-relaxed">{highlight.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

export default EducationSection
