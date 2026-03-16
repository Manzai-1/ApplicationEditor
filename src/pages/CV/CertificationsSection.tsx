import type { Certification } from '@/types/cv'

interface CertificationsSectionProps {
  data: Certification[]
}

function CertificationsSection({ data }: CertificationsSectionProps) {
  return (
    <section>
      <h2 className="text-2xl font-semibold text-foreground mb-3">Certifications</h2>
      {data.length === 0 ? (
        <p className="text-sm text-muted-foreground italic">No certifications added</p>
      ) : (
        <div className="space-y-1">
          {data.map((cert) => (
            <p key={cert.id} className="text-foreground">
              {cert.title}
            </p>
          ))}
        </div>
      )}
    </section>
  )
}

export default CertificationsSection
