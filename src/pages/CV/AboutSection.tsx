interface AboutSectionProps {
  text: string
}

function AboutSection({ text }: AboutSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">About</h2>
      <p className="text-foreground leading-relaxed">{text}</p>
    </section>
  )
}

export default AboutSection
