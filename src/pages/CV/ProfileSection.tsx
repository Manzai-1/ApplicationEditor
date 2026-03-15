import type { UserProfile } from '@/types/cv'

interface ProfileSectionProps {
  profile: UserProfile
}

function ProfileSection({ profile }: ProfileSectionProps) {
  return (
    <section>
      <h1 className="text-3xl font-bold text-foreground">{profile.name}</h1>
      <p className="text-xl text-foreground mb-4">{profile.title}</p>
      <div className="space-y-1 text-sm text-foreground">
        <p>Email: {profile.email}</p>
        <p>Phone: {profile.phone.display}</p>
        <p>Location: {profile.location}</p>
        <p>
          LinkedIn:{' '}
          <a href={profile.linkedin.url} className="hover:underline">
            {profile.linkedin.url}
          </a>
        </p>
        <p>
          GitHub:{' '}
          <a href={profile.github.url} className="hover:underline">
            {profile.github.url}
          </a>
        </p>
      </div>
    </section>
  )
}

export default ProfileSection
