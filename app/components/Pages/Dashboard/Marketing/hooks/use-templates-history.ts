import { useState, useEffect } from 'react'

import { deleteTemplateInstance } from 'models/instant-marketing/delete-template-instance'
import { getHistory } from 'models/instant-marketing/get-history'

export const DEFAULT_TEMPLATE_MEDIUMS: IMarketingTemplateMedium[] = [
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

export const DEFAULT_TEMPLATE_ASSOCIATIONS = ['template_instance.template']

export const DEFAULT_TEMPLATE_OMIT = ['template_instance.html']

export const USE_TEMPLATE_HISTORY_DEFAULT_OPTION: TemplatesHistoryOptions = {
  mediums: DEFAULT_TEMPLATE_MEDIUMS,
  associations: DEFAULT_TEMPLATE_ASSOCIATIONS,
  omit: DEFAULT_TEMPLATE_OMIT
}

interface TemplatesHistory {
  templates: IMarketingTemplateInstance[]
  isLoading: boolean
  error: Nullable<Error>
  deleteTemplate: (id: UUID) => Promise<void>
}

interface TemplatesHistoryOptions {
  mediums?: IMarketingTemplateMedium[]
  templateTypes?: IMarketingTemplateType[]
  associations: string[]
  omit?: string[]
  limit?: number
}

export function useTemplatesHistory({
  mediums,
  templateTypes,
  associations,
  omit,
  limit
}: TemplatesHistoryOptions = USE_TEMPLATE_HISTORY_DEFAULT_OPTION): TemplatesHistory {
  const [templates, setTemplates] = useState<IMarketingTemplateInstance[]>([])
  const [isLoading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    let didCancel = false

    async function loadData() {
      try {
        setLoading(true)

        // get templates history
        const templates = await getHistory({
          'associations[]': associations,
          'omit[]': omit,
          'mediums[]': mediums,
          'templateTypes[]': templateTypes,
          limit
        })

        // Setting states
        if (!didCancel) {
          setTemplates(templates)
          setLoading(false)
        }
      } catch (error) {
        console.log(error)

        setError(error)

        if (!didCancel) {
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      didCancel = true
    }
  }, [associations, limit, mediums, omit, templateTypes])

  async function deleteTemplate(id: UUID): Promise<void> {
    await deleteTemplateInstance(id)
    setTemplates(templates.filter(item => item.id !== id))
  }

  return { templates, isLoading, error, deleteTemplate }
}
