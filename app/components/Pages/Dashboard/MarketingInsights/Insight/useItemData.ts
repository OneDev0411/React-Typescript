import { useEffect, useState } from 'react'

import { getEmailCampaign } from 'models/email/get-email-campaign'

export default function useItemData(emailCampaignId: string) {
  const [isLoading, setLoading] = useState<boolean>(true)
  const [hasError, setError] = useState<boolean>(false)
  const [item, setItem] = useState<IEmailCampaign<
    'from' | 'emails' | 'recipients'
  > | null>(null)

  function loadEmailCampaign() {
    return getEmailCampaign(emailCampaignId, {
      emailCampaignAssociations: ['emails', 'from', 'recipients'],
      emailRecipientsAssociations: [],
      emailCampaignEmailsAssociation: []
    })
      .then(data => {
        setError(false)
        setLoading(false)
        setItem(data)
      })
      .catch(error => {
        // TODO: Add error state
        console.error(error)
      })
  }

  useEffect(() => {
    loadEmailCampaign()
  }, [emailCampaignId])

  return {
    item,
    isLoading,
    hasError,
    reload: loadEmailCampaign
  }
}
