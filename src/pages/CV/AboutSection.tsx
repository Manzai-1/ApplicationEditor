import type { About } from '@/types/cv'

interface AboutSectionProps {
  data: About[]
}

function AboutSection({ data }: AboutSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">About</h2>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No about text added</p>
      ) : (
        <div className="space-y-3">
          {data.map((item) => (
            <p key={item.id} className="text-foreground leading-relaxed">
              {item.text}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

export default AboutSection
