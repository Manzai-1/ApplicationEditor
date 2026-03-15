import type { Experience } from '@/types/cv'

interface ExperiencesSectionProps {
  experiences: Experience[]
}

function ExperiencesSection({ experiences }: ExperiencesSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-4">Experience</h2>
      <div className="space-y-6">
        {experiences.map((exp) => (
          <div key={`${exp.company}-${exp.year}`} className="grid grid-cols-[120px_1fr] gap-x-3">
            <span className="text-sm font-medium text-muted-foreground">{exp.year}</span>
            <div>
              <h3 className="text-lg font-semibold text-foreground">
                {exp.title}, {exp.company}
              </h3>
              <p className="text-muted-foreground leading-relaxed mt-1">{exp.description}</p>
              {exp.highlights.length > 0 && (
                <div className="ml-4 border-l-2 border-border pl-4 mt-3 space-y-3">
                  {exp.highlights.map((highlight) => (
                    <div key={highlight.title}>
                      <p className="font-bold text-foreground mb-0.5">{highlight.title}</p>
                      <p className="text-muted-foreground leading-relaxed">{highlight.description}</p>
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

export default ExperiencesSection
