import { useEffect, useState } from 'react'

import getCampaign from '../../../../../models/insights/emails/get-campaign-by-id'

function useItemData(id) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [hasError, setError] = useState<boolean>(false)
  const [item, setItem] = useState<IInsight | null>(null)

  useEffect(() => {
    getCampaign(id)
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
