import { useState, useEffect } from 'react'

import { getTemplates } from 'models/instant-marketing/get-templates'
import { deleteBrandTemplate } from 'models/instant-marketing/delete-brand-template'

const ALL_MEDIUMS = [
  'Email',
  'Social',
  'Letter',
  'LinkedInCover',
  'FacebookCover',
  'InstagramStory'
]

interface TemplatesData {
  templates: IBrandMarketingTemplate[]
  isLoading: boolean
  error: Nullable<Error>
  deleteTemplate: (template: IBrandMarketingTemplate) => Promise<void>
}

export function useTemplates(
  brandId: UUID,
  mediums: string[] = ALL_MEDIUMS
): TemplatesData {
  const [templates, setTemplates] = useState<IBrandMarketingTemplate[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let didCancel = false

    async function fetchTemplates() {
      if (!brandId) {
        return
      }

      try {
        setIsLoading(true)

        const templates = await getTemplates(brandId, [], mediums)

        if (!didCancel) {
          setTemplates(templates)
          setIsLoading(false)
          setError(null)
        }
      } catch (error) {
        if (!didCancel) {
          setTemplates([])
          setIsLoading(false)
          setError(error)
        }
      }
    }

    fetchTemplates()

    return () => {
      didCancel = true
    }
  }, [brandId, mediums])

  const deleteTemplate = async (template: IBrandMarketingTemplate) => {
    await deleteBrandTemplate(template.brand, template.id)
    setTemplates(templates.filter(item => item.id !== template.id))
  }

  return { templates, isLoading, deleteTemplate, error }
}
