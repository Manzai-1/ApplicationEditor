import { useState } from 'react'
import { useCVData } from '@/context/CVDataContext'
import EditableBlock from '@/components/cv/EditableBlock'
import CVEditModal from '@/components/cv/CVEditModal'
import ProfileSection from '@/pages/CV/ProfileSection'
import AboutSection from '@/pages/CV/AboutSection'
import SkillsSection from '@/pages/CV/SkillsSection'
import LanguagesSection from '@/pages/CV/LanguagesSection'
import ExperiencesSection from '@/pages/CV/ExperiencesSection'
import EducationSection from '@/pages/CV/EducationSection'
import CertificationsSection from '@/pages/CV/CertificationsSection'
import type {
  ProfileData,
  AboutData,
  SkillsData,
  LanguagesData,
  ExperiencesData,
  EducationData,
  CertificationsData,
} from '@/types/cv'

type SectionType =
  | 'profile'
  | 'about'
  | 'skills'
  | 'languages'
  | 'experiences'
  | 'education'
  | 'certifications'

type SectionData =
  | ProfileData
  | AboutData
  | SkillsData
  | LanguagesData
  | ExperiencesData
  | EducationData
  | CertificationsData

function CV() {
  const {
    isLoading,
    error,
    selectedCvId,
    profileData,
    aboutData,
    skillsData,
    languagesData,
    experiencesData,
    educationData,
    certificationsData,
    updateProfile,
    updateAbout,
    updateSkills,
    updateLanguages,
    updateExperiences,
    updateEducation,
    updateCertifications,
  } = useCVData()

  const [editingSection, setEditingSection] = useState<SectionType | null>(null)

  if (isLoading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">Loading...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!selectedCvId || !profileData) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8 flex items-center justify-center min-h-[50vh]">
        <p className="text-muted-foreground">No CV selected</p>
      </div>
    )
  }

  const sectionDataMap: Record<SectionType, SectionData | null> = {
    profile: profileData,
    about: aboutData,
    skills: skillsData,
    languages: languagesData,
    experiences: experiencesData,
    education: educationData,
    certifications: certificationsData,
  }

  const handleSave = async (data: SectionData) => {
    switch (editingSection) {
      case 'profile':
        await updateProfile(data as ProfileData)
        break
      case 'about':
        await updateAbout(data as AboutData)
        break
      case 'skills':
        await updateSkills(data as SkillsData)
        break
      case 'languages':
        await updateLanguages(data as LanguagesData)
        break
      case 'experiences':
        await updateExperiences(data as ExperiencesData)
        break
      case 'education':
        await updateEducation(data as EducationData)
        break
      case 'certifications':
        await updateCertifications(data as CertificationsData)
        break
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <EditableBlock onEdit={() => setEditingSection('profile')}>
          <ProfileSection data={profileData} />
        </EditableBlock>
        {aboutData && (
          <EditableBlock onEdit={() => setEditingSection('about')}>
            <AboutSection data={aboutData} />
          </EditableBlock>
        )}
        {skillsData && (
          <EditableBlock onEdit={() => setEditingSection('skills')}>
            <SkillsSection data={skillsData} />
          </EditableBlock>
        )}
        {languagesData && (
          <EditableBlock onEdit={() => setEditingSection('languages')}>
            <LanguagesSection data={languagesData} />
          </EditableBlock>
        )}
        {experiencesData && (
          <EditableBlock onEdit={() => setEditingSection('experiences')}>
            <ExperiencesSection data={experiencesData} />
          </EditableBlock>
        )}
        {educationData && (
          <EditableBlock onEdit={() => setEditingSection('education')}>
            <EducationSection data={educationData} />
          </EditableBlock>
        )}
        {certificationsData && (
          <EditableBlock onEdit={() => setEditingSection('certifications')}>
            <CertificationsSection data={certificationsData} />
          </EditableBlock>
        )}
      </div>

      {editingSection && sectionDataMap[editingSection] && (
        <CVEditModal
          open={!!editingSection}
          onClose={() => setEditingSection(null)}
          section={editingSection}
          data={sectionDataMap[editingSection]!}
          onSave={handleSave}
        />
      )}
    </>
  )
}

export default CV
