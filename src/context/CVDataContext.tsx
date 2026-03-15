import { createContext, useContext, useState, type ReactNode } from 'react'
import type {
  ProfileData,
  AboutData,
  SkillsData,
  LanguagesData,
  ExperiencesData,
  EducationData,
  CertificationsData,
} from '@/types/cv'
import cvData from '@/config/cv.json'

interface CVDataContextValue {
  profileData: ProfileData
  aboutData: AboutData
  skillsData: SkillsData
  languagesData: LanguagesData
  experiencesData: ExperiencesData
  educationData: EducationData
  certificationsData: CertificationsData
  updateProfile: (data: ProfileData) => Promise<void>
  updateAbout: (data: AboutData) => Promise<void>
  updateSkills: (data: SkillsData) => Promise<void>
  updateLanguages: (data: LanguagesData) => Promise<void>
  updateExperiences: (data: ExperiencesData) => Promise<void>
  updateEducation: (data: EducationData) => Promise<void>
  updateCertifications: (data: CertificationsData) => Promise<void>
}

const CVDataContext = createContext<CVDataContextValue | null>(null)

export function CVDataProvider({ children }: { children: ReactNode }) {
  const [profileData, setProfileData] = useState<ProfileData>(cvData.profile)
  const [aboutData, setAboutData] = useState<AboutData>(cvData.about)
  const [skillsData, setSkillsData] = useState<SkillsData>(cvData.skills)
  const [languagesData, setLanguagesData] = useState<LanguagesData>(cvData.languages)
  const [experiencesData, setExperiencesData] = useState<ExperiencesData>(cvData.experiences)
  const [educationData, setEducationData] = useState<EducationData>(cvData.education)
  const [certificationsData, setCertificationsData] = useState<CertificationsData>(cvData.certifications)

  const updateProfile = async (data: ProfileData): Promise<void> => {
    setProfileData(data)
  }

  const updateAbout = async (data: AboutData): Promise<void> => {
    setAboutData(data)
  }

  const updateSkills = async (data: SkillsData): Promise<void> => {
    setSkillsData(data)
  }

  const updateLanguages = async (data: LanguagesData): Promise<void> => {
    setLanguagesData(data)
  }

  const updateExperiences = async (data: ExperiencesData): Promise<void> => {
    setExperiencesData(data)
  }

  const updateEducation = async (data: EducationData): Promise<void> => {
    setEducationData(data)
  }

  const updateCertifications = async (data: CertificationsData): Promise<void> => {
    setCertificationsData(data)
  }

  return (
    <CVDataContext.Provider
      value={{
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
      }}
    >
      {children}
    </CVDataContext.Provider>
  )
}

export function useCVData() {
  const context = useContext(CVDataContext)
  if (!context) {
    throw new Error('useCVData must be used within a CVDataProvider')
  }
  return context
}
