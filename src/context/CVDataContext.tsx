import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react'
import type {
  ProfileData,
  AboutData,
  SkillsData,
  LanguagesData,
  ExperiencesData,
  EducationData,
  CertificationsData,
  CVListItem,
} from '@/types/cv'
import { getProfile, updateProfile as updateProfileApi } from '@/services/profile'
import { getCVList, getCV, transformApiCV, updateComponent } from '@/services/cv'

interface CVDataContextValue {
  // Loading states
  isLoading: boolean
  error: string | null

  // CV list
  cvList: CVListItem[]
  selectedCvId: string | null
  selectCV: (cvId: string) => Promise<void>

  // Data
  profileData: ProfileData | null
  aboutData: AboutData | null
  skillsData: SkillsData | null
  languagesData: LanguagesData | null
  experiencesData: ExperiencesData | null
  educationData: EducationData | null
  certificationsData: CertificationsData | null

  // Update functions
  updateProfile: (data: ProfileData) => Promise<void>
  updateAbout: (data: AboutData) => Promise<void>
  updateSkills: (data: SkillsData) => Promise<void>
  updateLanguages: (data: LanguagesData) => Promise<void>
  updateExperiences: (data: ExperiencesData) => Promise<void>
  updateEducation: (data: EducationData) => Promise<void>
  updateCertifications: (data: CertificationsData) => Promise<void>

  // Reload
  refreshCV: () => Promise<void>
}

const CVDataContext = createContext<CVDataContextValue | null>(null)

export function CVDataProvider({ children }: { children: ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [cvList, setCvList] = useState<CVListItem[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null)

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [aboutData, setAboutData] = useState<(AboutData & { _id?: string }) | null>(null)
  const [skillsData, setSkillsData] = useState<SkillsData | null>(null)
  const [languagesData, setLanguagesData] = useState<LanguagesData | null>(null)
  const [experiencesData, setExperiencesData] = useState<ExperiencesData | null>(null)
  const [educationData, setEducationData] = useState<EducationData | null>(null)
  const [certificationsData, setCertificationsData] = useState<CertificationsData | null>(null)

  const loadCV = useCallback(async (cvId: string) => {
    const apiCV = await getCV(cvId)
    const transformed = transformApiCV(apiCV)
    setAboutData(transformed.aboutData)
    setSkillsData(transformed.skillsData)
    setLanguagesData(transformed.languagesData)
    setExperiencesData(transformed.experiencesData)
    setEducationData(transformed.educationData)
    setCertificationsData(transformed.certificationsData)
  }, [])

  const selectCV = useCallback(async (cvId: string) => {
    setIsLoading(true)
    setError(null)
    try {
      await loadCV(cvId)
      setSelectedCvId(cvId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load CV')
    } finally {
      setIsLoading(false)
    }
  }, [loadCV])

  const refreshCV = useCallback(async () => {
    if (!selectedCvId) return
    setIsLoading(true)
    setError(null)
    try {
      await loadCV(selectedCvId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh CV')
    } finally {
      setIsLoading(false)
    }
  }, [selectedCvId, loadCV])

  // Initial load
  useEffect(() => {
    async function init() {
      setIsLoading(true)
      setError(null)
      try {
        const [profile, cvs] = await Promise.all([getProfile(), getCVList()])
        setProfileData(profile)
        setCvList(cvs)

        if (cvs.length > 0) {
          const firstCvId = cvs[0].id
          await loadCV(firstCvId)
          setSelectedCvId(firstCvId)
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsLoading(false)
      }
    }
    init()
  }, [loadCV])

  const updateProfile = async (data: ProfileData): Promise<void> => {
    const updated = await updateProfileApi(data)
    setProfileData(updated)
  }

  const updateAbout = async (data: AboutData): Promise<void> => {
    const current = aboutData as AboutData & { _id?: string }
    if (current?._id) {
      await updateComponent('about', current._id, { text: data.text })
    }
    setAboutData({ ...data, _id: current?._id })
  }

  const updateSkills = async (data: SkillsData): Promise<void> => {
    // For now, update local state - full sync requires more complex diffing
    // This will be enhanced when we add create/delete/reorder support
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
        isLoading,
        error,
        cvList,
        selectedCvId,
        selectCV,
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
        refreshCV,
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
