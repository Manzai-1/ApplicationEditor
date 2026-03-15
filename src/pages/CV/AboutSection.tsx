import type { AboutData } from '@/types/cv'

interface AboutSectionProps {
  data: AboutData
}

function AboutSection({ data }: AboutSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">About</h2>
      <p className="text-foreground leading-relaxed">{data.text}</p>
    </section>
  )
}

export default AboutSection
