import { useState, useEffect } from 'react'

import { getHistory } from 'models/instant-marketing/get-history'

function useTemplatesHistory() {
  const [templates, setTemplates] = useState([])
  const [isLoading, setLoading] = useState(false)

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

  return [templates, isLoading]
}

export default useTemplatesHistory
