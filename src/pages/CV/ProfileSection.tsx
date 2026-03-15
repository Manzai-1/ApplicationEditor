import type { ProfileData } from '@/types/cv'

interface ProfileSectionProps {
  data: ProfileData
}

function ProfileSection({ data }: ProfileSectionProps) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-foreground">{data.name}</h1>
      <p className="text-xl text-foreground mb-4">{data.title}</p>
      <div className="space-y-1 text-sm text-foreground">
        <p>Email: {data.email}</p>
        <p>Phone: {data.phone.display}</p>
        <p>Location: {data.location}</p>
        <p>
          LinkedIn:{' '}
          <a href={data.linkedin.url} className="hover:underline">
            {data.linkedin.url}
          </a>
        </p>
        <p>
          GitHub:{' '}
          <a href={data.github.url} className="hover:underline">
            {data.github.url}
          </a>
        </p>
      </div>
    </section>
  )
}

export default ProfileSection
