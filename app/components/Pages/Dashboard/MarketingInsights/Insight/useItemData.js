import { useEffect, useState } from 'react'

import getCampaing from '../../../../../models/insights/emails/get-campaign-by-id'

function useItemData(id) {
  const [isLoading, setLoading] = useState(true)
  const [hasError, setError] = useState(false)
  const [item, setItem] = useState({})

  useEffect(() => {
    getCampaing(id)
      .then(data => {
        setError(false)
        setLoading(false)
        setItem(data)
      })
      .catch(e => {
        // Todo: Adding error state
        console.log(e)
      })
  }, [id])

  return {
    item,
    isLoading,
    hasError
  }
}

export default useItemData
