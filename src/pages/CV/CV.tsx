import { userProfile, cvData } from '@/config/cvData'
import ProfileSection from '@/pages/CV/ProfileSection'
import AboutSection from '@/pages/CV/AboutSection'
import SkillsSection from '@/pages/CV/SkillsSection'
import LanguagesSection from '@/pages/CV/LanguagesSection'
import ExperiencesSection from '@/pages/CV/ExperiencesSection'
import EducationSection from '@/pages/CV/EducationSection'
import CertificationsSection from '@/pages/CV/CertificationsSection'

function CV() {
  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <ProfileSection profile={userProfile} />
      <AboutSection text={cvData.aboutText} />
      <SkillsSection skills={cvData.skills} />
      <LanguagesSection languages={cvData.languages} />
      <ExperiencesSection experiences={cvData.experiences} />
      <EducationSection education={cvData.education} />
      <CertificationsSection certifications={cvData.certifications} />
    </div>
  )
}

export default CV
