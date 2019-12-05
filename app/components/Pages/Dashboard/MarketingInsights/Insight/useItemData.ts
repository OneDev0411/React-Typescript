import { useEffect, useState } from 'react'

import { getEmailCampaign } from 'models/email/get-email-campaign'

function useItemData(id) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [hasError, setError] = useState<boolean>(false)
  const [item, setItem] = useState<IEmailCampaign<
    IEmailCampaignAssociation,
    IEmailCampaignRecipientAssociation,
    IEmailCampaignEmailAssociation
  > | null>(null)

  useEffect(() => {
    getEmailCampaign(id, undefined, undefined, undefined, ['html', 'text'])
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
