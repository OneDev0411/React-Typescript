import { useState, useEffect } from 'react'

import { getTemplates } from 'models/instant-marketing/get-templates'

const ALL_MEDIUMS = [
  'Email',
  'Social',
  'LinkedInCover',
  'FacebookCover',
  'InstagramStory'
]

interface TemplatesList {
  templates: IMarketingTemplate[]
  loading: boolean
  error: Error | null
}

export function useTemplates(
  brandId: UUID,
  mediums: string[] = ALL_MEDIUMS
): TemplatesList {
  const [templates, setTemplates] = useState<IMarketingTemplate[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let didCancel = false

    async function fetchTemplates() {
      if (!brandId) {
        return
      }

      try {
        setLoading(true)

        const templates = await getTemplates(brandId, [], mediums)

        if (!didCancel) {
          setTemplates(templates)
          setLoading(false)
          setError(null)
        }
      } catch (error) {
        if (!didCancel) {
          console.error(error)
          setLoading(false)
          setError(error)
        }
      }
    }

    fetchTemplates()

    return () => {
      didCancel = true
    }
  }, [brandId, mediums])

  return {
    templates,
    loading,
    error
  }
}
