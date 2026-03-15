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

  const sectionDataMap: Record<SectionType, SectionData> = {
    profile: profileData,
    about: aboutData,
    skills: skillsData,
    languages: languagesData,
    experiences: experiencesData,
    education: educationData,
    certifications: certificationsData,
  }

  const handleSave = (data: SectionData) => {
    switch (editingSection) {
      case 'profile':
        updateProfile(data as ProfileData)
        break
      case 'about':
        updateAbout(data as AboutData)
        break
      case 'skills':
        updateSkills(data as SkillsData)
        break
      case 'languages':
        updateLanguages(data as LanguagesData)
        break
      case 'experiences':
        updateExperiences(data as ExperiencesData)
        break
      case 'education':
        updateEducation(data as EducationData)
        break
      case 'certifications':
        updateCertifications(data as CertificationsData)
        break
    }
  }

  return (
    <>
      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">
        <EditableBlock onEdit={() => setEditingSection('profile')}>
          <ProfileSection data={profileData} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('about')}>
          <AboutSection data={aboutData} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('skills')}>
          <SkillsSection data={skillsData} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('languages')}>
          <LanguagesSection data={languagesData} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('experiences')}>
          <ExperiencesSection data={experiencesData} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('education')}>
          <EducationSection data={educationData} />
        </EditableBlock>
        <EditableBlock onEdit={() => setEditingSection('certifications')}>
          <CertificationsSection data={certificationsData} />
        </EditableBlock>
      </div>

      {editingSection && (
        <CVEditModal
          open={!!editingSection}
          onClose={() => setEditingSection(null)}
          section={editingSection}
          data={sectionDataMap[editingSection]}
          onSave={handleSave}
        />
      )}
    </>
  )
}

export default CV
