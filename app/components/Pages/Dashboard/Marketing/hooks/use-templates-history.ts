import { useState, useEffect } from 'react'

import { deleteTemplateInstance } from 'models/instant-marketing/delete-template-instance'
import { getHistory } from 'models/instant-marketing/get-history'

interface TemplatesHistory {
  templates: IMarketingTemplateInstance[]
  isLoading: boolean
  error: Nullable<Error>
  deleteTemplate: (id: UUID) => Promise<void>
}

export function useTemplatesHistory(): TemplatesHistory {
  const [templates, setTemplates] = useState<IMarketingTemplateInstance[]>([])
  const [isLoading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    let didCancel = false

    async function loadData() {
      try {
        setLoading(true)

        // get templates history
        const templates = await getHistory({
          'associations[]': [
            'template_instance.template',
            'template_instance.deals',
            'template_instance.contacts',
            'template_instance.listings'
          ]
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
  }, [])

  async function deleteTemplate(id: UUID): Promise<void> {
    await deleteTemplateInstance(id)
    setTemplates(templates.filter(item => item.id !== id))
  }

  return { templates, isLoading, error, deleteTemplate }
}
