import { useContext } from 'react'

import { SuperCampaignIdContext } from './context'

export function useSuperCampaignId() {
  const context = useContext(SuperCampaignIdContext)

  if (!context) {
    throw new Error(
      'The useSuperCampaignId must be used within SuperCampaignIdProvider'
    )
  }

  return context
}
