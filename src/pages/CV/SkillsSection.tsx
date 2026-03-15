import type { Skill } from '@/types/cv'

interface SkillsSectionProps {
  skills: Skill[]
}

function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Skills</h2>
      <div className="space-y-2">
        {skills.map((skill) => (
          <p key={skill.header}>
            <span className="font-semibold text-foreground">{skill.header}:</span>{' '}
            <span className="text-muted-foreground">{skill.items.join(', ')}</span>
          </p>
        ))}
      </div>
    </section>
  )
}

export default SkillsSection
