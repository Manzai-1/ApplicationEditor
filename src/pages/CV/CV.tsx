import { useCVData } from '@/context/CVDataContext'
import EditableBlock from '@/components/cv/EditableBlock'
import ProfileSection from '@/pages/CV/ProfileSection'
import AboutSection from '@/pages/CV/AboutSection'
import SkillsSection from '@/pages/CV/SkillsSection'
import LanguagesSection from '@/pages/CV/LanguagesSection'
import ExperiencesSection from '@/pages/CV/ExperiencesSection'
import EducationSection from '@/pages/CV/EducationSection'
import CertificationsSection from '@/pages/CV/CertificationsSection'

function CV() {
  const {
    profileData,
    aboutData,
    skillsData,
    languagesData,
    experiencesData,
    educationData,
    certificationsData,
  } = useCVData()

  const handleEditProfile = () => {}
  const handleEditAbout = () => {}
  const handleEditSkills = () => {}
  const handleEditLanguages = () => {}
  const handleEditExperiences = () => {}
  const handleEditEducation = () => {}
  const handleEditCertifications = () => {}

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
      <EditableBlock onEdit={handleEditProfile}>
        <ProfileSection data={profileData} />
      </EditableBlock>
      <EditableBlock onEdit={handleEditAbout}>
        <AboutSection data={aboutData} />
      </EditableBlock>
      <EditableBlock onEdit={handleEditSkills}>
        <SkillsSection data={skillsData} />
      </EditableBlock>
      <EditableBlock onEdit={handleEditLanguages}>
        <LanguagesSection data={languagesData} />
      </EditableBlock>
      <EditableBlock onEdit={handleEditExperiences}>
        <ExperiencesSection data={experiencesData} />
      </EditableBlock>
      <EditableBlock onEdit={handleEditEducation}>
        <EducationSection data={educationData} />
      </EditableBlock>
      <EditableBlock onEdit={handleEditCertifications}>
        <CertificationsSection data={certificationsData} />
      </EditableBlock>
    </div>
  )
}

export default CV
