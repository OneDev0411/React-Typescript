import { useContext } from 'react'

import { SuperCampaignDetailContext } from './context'

export function useSuperCampaign() {
  const context = useContext(SuperCampaignDetailContext)

  if (!context) {
    throw new Error(
      'The useSuperCampaignDetail must be used within SuperCampaignDetailProvider'
    )
  }

  return context
}
