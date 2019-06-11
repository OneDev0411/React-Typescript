import { useState, useEffect } from 'react'

import { getTemplates } from 'models/instant-marketing/get-templates'

function useTemplatesList(types) {
  const [templates, setTemplates] = useState([])
  const [isLoading, setLoading] = useState(false)

  useEffect(() => {
    let didCancel = false

    async function loadData() {
      try {
        setLoading(true)

        // get templates
        const templates = await getTemplates(types.split(','), [
          'Email',
          'Social',
          'LinkedInCover',
          'FacebookCover',
          'InstagramStory'
        ])

        // Setting states
        if (!didCancel) {
          setTemplates(templates)
          setLoading(false)
        }
      } catch (error) {
        if (!didCancel) {
          console.log(error)
          setLoading(false)
        }
      }
    }

    loadData()

    return () => {
      didCancel = true
    }
  }, [types])

  return [templates, isLoading]
}

export default useTemplatesList
