import type { Experience } from '@/types/cv'

interface ExperiencesSectionProps {
  data: Experience[]
}

function ExperiencesSection({ data }: ExperiencesSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-4">Experience</h2>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No experiences added</p>
      ) : (
        <div className="space-y-6">
          {data.map((exp) => (
            <div key={exp.id} className="grid grid-cols-[120px_1fr] gap-x-3">
              <span className="text-sm font-medium text-foreground">{exp.year}</span>
              <div>
                <h3 className="text-lg font-semibold text-foreground">
                  {exp.title}, {exp.company}
                </h3>
                <p className="text-foreground leading-relaxed mt-1">{exp.description}</p>
                {exp.highlights.length > 0 && (
                  <div className="ml-4 border-l-2 border-border pl-4 mt-3 space-y-3">
                    {exp.highlights.map((highlight) => (
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
      )}
    </section>
  )
}

export default ExperiencesSection
