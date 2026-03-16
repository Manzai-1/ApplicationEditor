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
  About,
  Skill,
  Language,
  Experience,
  Education,
  Certification,
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
  | About[]
  | Skill[]
  | Language[]
  | Experience[]
  | Education[]
  | Certification[]

function CV() {
  const {
    isLoading,
    error,
    selectedCvId,
    profileData,
    about,
    skills,
    languages,
    experiences,
    education,
    certifications,
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
    about,
    skills,
    languages,
    experiences,
    education,
    certifications,
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <EditableBlock onEdit={() => setEditingSection('profile')}>
          <ProfileSection data={profileData} />
        </EditableBlock>
        {about.length > 0 && (
          <EditableBlock onEdit={() => setEditingSection('about')}>
            <AboutSection data={about} />
          </EditableBlock>
        )}
        {skills.length > 0 && (
          <EditableBlock onEdit={() => setEditingSection('skills')}>
            <SkillsSection data={skills} />
          </EditableBlock>
        )}
        {languages.length > 0 && (
          <EditableBlock onEdit={() => setEditingSection('languages')}>
            <LanguagesSection data={languages} />
          </EditableBlock>
        )}
        {experiences.length > 0 && (
          <EditableBlock onEdit={() => setEditingSection('experiences')}>
            <ExperiencesSection data={experiences} />
          </EditableBlock>
        )}
        {education.length > 0 && (
          <EditableBlock onEdit={() => setEditingSection('education')}>
            <EducationSection data={education} />
          </EditableBlock>
        )}
        {certifications.length > 0 && (
          <EditableBlock onEdit={() => setEditingSection('certifications')}>
            <CertificationsSection data={certifications} />
          </EditableBlock>
        )}
      </div>

      {editingSection && sectionDataMap[editingSection] && (
        <CVEditModal
          open={!!editingSection}
          onClose={() => setEditingSection(null)}
          section={editingSection}
          data={sectionDataMap[editingSection]!}
        />
      )}
    </>
  )
}

export default CV
