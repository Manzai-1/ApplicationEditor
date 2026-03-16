import { useState } from 'react'
import { useCVData } from '@/context/CVDataContext'
import EditableBlock from '@/components/cv/EditableBlock'
import CVEditModal from '@/components/cv/CVEditModal'
import CVNameHeader from '@/components/cv/CVNameHeader'
import EmptyState from '@/components/layout/EmptyState'
import Spinner from '@/components/ui/Spinner'
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
    isContentLoading,
    error,
    selectedCvId,
    selectedCV,
    profileData,
    about,
    skills,
    languages,
    experiences,
    education,
    certifications,
    createCV,
    selectCV,
    updateCVName,
  } = useCVData()

  const [editingSection, setEditingSection] = useState<SectionType | null>(null)

  const handleCreateTemplate = async () => {
    const newId = await createCV(0, 'Untitled Template')
    await selectCV(newId)
  }

  const handleCreateApplication = async () => {
    const newId = await createCV(1, 'Untitled Application')
    await selectCV(newId)
  }

  const handleUpdateCVName = async (newName: string) => {
    if (selectedCvId) {
      await updateCVName(selectedCvId, newName)
    }
  }

  if (!selectedCvId) {
    return (
      <EmptyState
        onCreateTemplate={handleCreateTemplate}
        onCreateApplication={handleCreateApplication}
      />
    )
  }

  if (isContentLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Spinner />
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-destructive">{error}</p>
      </div>
    )
  }

  if (!profileData) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="text-muted-foreground">No CV data found</p>
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
        <CVNameHeader name={selectedCV?.name ?? ''} onSave={handleUpdateCVName} />
        <EditableBlock onEdit={() => setEditingSection('profile')}>
          <ProfileSection data={profileData} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('about')}>
          <AboutSection data={about} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('skills')}>
          <SkillsSection data={skills} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('languages')}>
          <LanguagesSection data={languages} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('experiences')}>
          <ExperiencesSection data={experiences} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('education')}>
          <EducationSection data={education} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('certifications')}>
          <CertificationsSection data={certifications} />
        </EditableBlock>
      </div>

      {editingSection && (
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
