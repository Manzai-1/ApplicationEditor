import type { CertificationsData } from '@/types/cv'

interface CertificationsSectionProps {
  data: CertificationsData
}

function CertificationsSection({ data }: CertificationsSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Certifications</h2>
      <div className="space-y-1">
        {data.certifications.map((cert) => (
          <p key={cert.title} className="text-foreground">
            {cert.title}
          </p>
        ))}
      </div>
    </section>
  )
}

export default CertificationsSection
