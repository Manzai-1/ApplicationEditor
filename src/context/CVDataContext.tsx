import { createContext, useContext, useState, useEffect, useCallback, useMemo, type ReactNode } from 'react'
import type {
  ProfileData,
  CVListItem,
  About,
  Skill,
  Language,
  Experience,
  Education,
  Certification,
  NewAbout,
  NewSkill,
  NewLanguage,
  NewExperience,
  NewEducation,
  NewCertification,
} from '@/types/cv'
import { getProfile, updateProfile as updateProfileApi } from '@/services/profile'
import {
  getCVList,
  getCV,
  transformApiCV,
  transformComponentResponse,
  createComponent,
  updateComponent,
  deleteComponent,
  reorderComponents,
  createCV as createCVApi,
  updateCVName as updateCVNameApi,
  deleteCV as deleteCVApi,
  type ComponentType,
} from '@/services/cv'
import { useAuth } from '@/hooks/useAuth'

type BaseComponent = { id: string; sortOrder: number }

interface ComponentCRUD<T extends BaseComponent, TNew> {
  create: (content: TNew) => Promise<T>
  update: (id: string, content: Omit<T, 'id' | 'sortOrder'>) => Promise<void>
  delete: (id: string) => Promise<void>
  reorder: (orderedIds: string[]) => Promise<void>
}

interface CVDataContextValue {
  isListLoading: boolean
  isContentLoading: boolean
  error: string | null

  cvList: CVListItem[]
  templates: CVListItem[]
  applications: CVListItem[]
  fetchCVList: () => Promise<void>

  selectedCvId: string | null
  selectedCV: CVListItem | null
  selectCV: (cvId: string) => Promise<void>
  clearSelection: () => void
  refreshCV: () => Promise<void>

  createCV: (type: 0 | 1, name: string) => Promise<string>
  updateCVName: (cvId: string, name: string) => Promise<void>
  deleteCV: (cvId: string) => Promise<void>

  profileData: ProfileData | null
  about: About[]
  skills: Skill[]
  languages: Language[]
  experiences: Experience[]
  education: Education[]
  certifications: Certification[]

  updateProfile: (data: ProfileData) => Promise<void>

  createAbout: (content: NewAbout) => Promise<About>
  updateAbout: (id: string, content: Omit<About, 'id' | 'sortOrder'>) => Promise<void>
  deleteAbout: (id: string) => Promise<void>
  reorderAbout: (orderedIds: string[]) => Promise<void>

  createSkill: (content: NewSkill) => Promise<Skill>
  updateSkill: (id: string, content: Omit<Skill, 'id' | 'sortOrder'>) => Promise<void>
  deleteSkill: (id: string) => Promise<void>
  reorderSkills: (orderedIds: string[]) => Promise<void>

  createLanguage: (content: NewLanguage) => Promise<Language>
  updateLanguage: (id: string, content: Omit<Language, 'id' | 'sortOrder'>) => Promise<void>
  deleteLanguage: (id: string) => Promise<void>
  reorderLanguages: (orderedIds: string[]) => Promise<void>

  createExperience: (content: NewExperience) => Promise<Experience>
  updateExperience: (id: string, content: Omit<Experience, 'id' | 'sortOrder'>) => Promise<void>
  deleteExperience: (id: string) => Promise<void>
  reorderExperiences: (orderedIds: string[]) => Promise<void>

  createEducation: (content: NewEducation) => Promise<Education>
  updateEducation: (id: string, content: Omit<Education, 'id' | 'sortOrder'>) => Promise<void>
  deleteEducation: (id: string) => Promise<void>
  reorderEducation: (orderedIds: string[]) => Promise<void>

  createCertification: (content: NewCertification) => Promise<Certification>
  updateCertification: (id: string, content: Omit<Certification, 'id' | 'sortOrder'>) => Promise<void>
  deleteCertification: (id: string) => Promise<void>
  reorderCertifications: (orderedIds: string[]) => Promise<void>
}

const CVDataContext = createContext<CVDataContextValue | null>(null)

function createCRUDFactory<T extends BaseComponent, TNew>(
  componentType: ComponentType,
  getState: () => T[],
  setState: React.Dispatch<React.SetStateAction<T[]>>,
  getCvId: () => string | null
): ComponentCRUD<T, TNew> {
  return {
    create: async (content: TNew): Promise<T> => {
      const cvId = getCvId()
      if (!cvId) throw new Error('No CV selected')

      const response = await createComponent(cvId, componentType, content)
      const created = transformComponentResponse<T>(response)
      setState((prev) => [...prev, created])
      return created
    },

    update: async (id: string, content: Omit<T, 'id' | 'sortOrder'>): Promise<void> => {
      const response = await updateComponent(componentType, id, content)
      const current = getState().find((item) => item.id === id)
      const updated = transformComponentResponse<T>(response, current?.sortOrder)
      setState((prev) => prev.map((item) => (item.id === id ? updated : item)))
    },

    delete: async (id: string): Promise<void> => {
      const cvId = getCvId()
      if (!cvId) throw new Error('No CV selected')

      await deleteComponent(cvId, componentType, id)
      setState((prev) => prev.filter((item) => item.id !== id))
    },

    reorder: async (orderedIds: string[]): Promise<void> => {
      const cvId = getCvId()
      if (!cvId) throw new Error('No CV selected')

      await reorderComponents(cvId, componentType, orderedIds)
      setState((prev) => {
        const itemMap = new Map(prev.map((item) => [item.id, item]))
        return orderedIds.map((id, index) => ({
          ...itemMap.get(id)!,
          sortOrder: index,
        }))
      })
    },
  }
}

function clearComponentState(
  setAbout: React.Dispatch<React.SetStateAction<About[]>>,
  setSkills: React.Dispatch<React.SetStateAction<Skill[]>>,
  setLanguages: React.Dispatch<React.SetStateAction<Language[]>>,
  setExperiences: React.Dispatch<React.SetStateAction<Experience[]>>,
  setEducation: React.Dispatch<React.SetStateAction<Education[]>>,
  setCertifications: React.Dispatch<React.SetStateAction<Certification[]>>
) {
  setAbout([])
  setSkills([])
  setLanguages([])
  setExperiences([])
  setEducation([])
  setCertifications([])
}

export function CVDataProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const isAuthenticated = !!user

  const [isListLoading, setIsListLoading] = useState(false)
  const [isContentLoading, setIsContentLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [cvList, setCvList] = useState<CVListItem[]>([])
  const [selectedCvId, setSelectedCvId] = useState<string | null>(null)

  const [profileData, setProfileData] = useState<ProfileData | null>(null)
  const [about, setAbout] = useState<About[]>([])
  const [skills, setSkills] = useState<Skill[]>([])
  const [languages, setLanguages] = useState<Language[]>([])
  const [experiences, setExperiences] = useState<Experience[]>([])
  const [education, setEducation] = useState<Education[]>([])
  const [certifications, setCertifications] = useState<Certification[]>([])

  const getCvId = useCallback(() => selectedCvId, [selectedCvId])

  const aboutCRUD = createCRUDFactory<About, NewAbout>('about', () => about, setAbout, getCvId)
  const skillCRUD = createCRUDFactory<Skill, NewSkill>('skill', () => skills, setSkills, getCvId)
  const languageCRUD = createCRUDFactory<Language, NewLanguage>('language', () => languages, setLanguages, getCvId)
  const experienceCRUD = createCRUDFactory<Experience, NewExperience>(
    'experience',
    () => experiences,
    setExperiences,
    getCvId
  )
  const educationCRUD = createCRUDFactory<Education, NewEducation>(
    'education',
    () => education,
    setEducation,
    getCvId
  )
  const certificationCRUD = createCRUDFactory<Certification, NewCertification>(
    'certification',
    () => certifications,
    setCertifications,
    getCvId
  )

  const templates = useMemo(() => cvList.filter((cv) => cv.type === 0), [cvList])
  const applications = useMemo(() => cvList.filter((cv) => cv.type === 1), [cvList])

  const selectedCV = useMemo(
    () => cvList.find((cv) => cv.id === selectedCvId) ?? null,
    [cvList, selectedCvId]
  )

  const fetchCVList = useCallback(async () => {
    if (!isAuthenticated) return

    setIsListLoading(true)
    setError(null)
    try {
      const cvs = await getCVList()
      setCvList(cvs)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch CV list')
    } finally {
      setIsListLoading(false)
    }
  }, [isAuthenticated])

  const loadCV = useCallback(async (cvId: string) => {
    const apiCV = await getCV(cvId)
    const transformed = transformApiCV(apiCV)
    setAbout(transformed.about)
    setSkills(transformed.skills)
    setLanguages(transformed.languages)
    setExperiences(transformed.experiences)
    setEducation(transformed.education)
    setCertifications(transformed.certifications)
  }, [])

  const selectCV = useCallback(
    async (cvId: string) => {
      setIsContentLoading(true)
      setError(null)
      try {
        await loadCV(cvId)
        setSelectedCvId(cvId)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load CV')
      } finally {
        setIsContentLoading(false)
      }
    },
    [loadCV]
  )

  const clearSelection = useCallback(() => {
    setSelectedCvId(null)
    clearComponentState(setAbout, setSkills, setLanguages, setExperiences, setEducation, setCertifications)
  }, [])

  const refreshCV = useCallback(async () => {
    if (!selectedCvId) return
    setIsContentLoading(true)
    setError(null)
    try {
      await loadCV(selectedCvId)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to refresh CV')
    } finally {
      setIsContentLoading(false)
    }
  }, [selectedCvId, loadCV])

  const createCV = useCallback(
    async (type: 0 | 1, name: string): Promise<string> => {
      const newCV = await createCVApi(type, name)
      setCvList((prev) => [...prev, newCV])
      return newCV.id
    },
    []
  )

  const updateCVName = useCallback(async (cvId: string, name: string): Promise<void> => {
    const updated = await updateCVNameApi(cvId, name)
    setCvList((prev) => prev.map((cv) => (cv.id === cvId ? updated : cv)))
  }, [])

  const deleteCV = useCallback(
    async (cvId: string): Promise<void> => {
      await deleteCVApi(cvId)
      setCvList((prev) => prev.filter((cv) => cv.id !== cvId))
      if (selectedCvId === cvId) {
        clearSelection()
      }
    },
    [selectedCvId, clearSelection]
  )

  const updateProfile = async (data: ProfileData): Promise<void> => {
    const updated = await updateProfileApi(data)
    setProfileData(updated)
  }

  useEffect(() => {
    if (!isAuthenticated) {
      setCvList([])
      setSelectedCvId(null)
      setProfileData(null)
      clearComponentState(setAbout, setSkills, setLanguages, setExperiences, setEducation, setCertifications)
      return
    }

    async function init() {
      setIsListLoading(true)
      setError(null)
      try {
        const [profile, cvs] = await Promise.all([getProfile(), getCVList()])
        setProfileData(profile)
        setCvList(cvs)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load data')
      } finally {
        setIsListLoading(false)
      }
    }
    init()
  }, [isAuthenticated])

  return (
    <CVDataContext.Provider
      value={{
        isListLoading,
        isContentLoading,
        error,
        cvList,
        templates,
        applications,
        fetchCVList,
        selectedCvId,
        selectedCV,
        selectCV,
        clearSelection,
        refreshCV,
        createCV,
        updateCVName,
        deleteCV,
        profileData,
        about,
        skills,
        languages,
        experiences,
        education,
        certifications,
        updateProfile,
        createAbout: aboutCRUD.create,
        updateAbout: aboutCRUD.update,
        deleteAbout: aboutCRUD.delete,
        reorderAbout: aboutCRUD.reorder,
        createSkill: skillCRUD.create,
        updateSkill: skillCRUD.update,
        deleteSkill: skillCRUD.delete,
        reorderSkills: skillCRUD.reorder,
        createLanguage: languageCRUD.create,
        updateLanguage: languageCRUD.update,
        deleteLanguage: languageCRUD.delete,
        reorderLanguages: languageCRUD.reorder,
        createExperience: experienceCRUD.create,
        updateExperience: experienceCRUD.update,
        deleteExperience: experienceCRUD.delete,
        reorderExperiences: experienceCRUD.reorder,
        createEducation: educationCRUD.create,
        updateEducation: educationCRUD.update,
        deleteEducation: educationCRUD.delete,
        reorderEducation: educationCRUD.reorder,
        createCertification: certificationCRUD.create,
        updateCertification: certificationCRUD.update,
        deleteCertification: certificationCRUD.delete,
        reorderCertifications: certificationCRUD.reorder,
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
