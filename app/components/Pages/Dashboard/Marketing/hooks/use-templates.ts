import { useState } from 'react'

import { useDeepCompareEffect } from 'react-use'

import { deleteBrandTemplate } from 'models/instant-marketing/delete-brand-template'
import { getTemplates } from 'models/instant-marketing/get-templates'

const ALL_MEDIUMS: IMarketingTemplateMedium[] = [
  'Email',
  'Social',
  'Letter',
  'LinkedInCover',
  'FacebookCover',
  'InstagramStory',
  'RealtorCover',
  'TwitterCover',
  'YouTubeCover'
]

interface TemplatesData {
  templates: IBrandMarketingTemplate[]
  isLoading: boolean
  error: Nullable<Error>
  deleteTemplate: (template: IBrandMarketingTemplate) => Promise<void>
}

export function useTemplates(
  brandId: Nullable<UUID>,
  mediums: IMarketingTemplateMedium[] = ALL_MEDIUMS,
  templateTypes: IMarketingTemplateType[] = []
): TemplatesData {
  const [templates, setTemplates] = useState<IBrandMarketingTemplate[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useDeepCompareEffect(() => {
    let didCancel = false

    async function fetchTemplates() {
      if (!brandId) {
        return
      }

      try {
        setIsLoading(true)

        const templates = await getTemplates(brandId, templateTypes, mediums)

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
  }, [brandId, mediums, templateTypes])

  const deleteTemplate = async (template: IBrandMarketingTemplate) => {
    await deleteBrandTemplate(template.brand, template.id)
    setTemplates(templates.filter(item => item.id !== template.id))
  }

  return { templates, isLoading, deleteTemplate, error }
}
