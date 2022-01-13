import { ReactNode } from 'react'

import { SuperCampaignIdContext } from './context'

interface SuperCampaignIdProviderProps {
  superCampaignId: UUID
  children: ReactNode
}

function SuperCampaignIdProvider({
  superCampaignId,
  children
}: SuperCampaignIdProviderProps) {
  return (
    <SuperCampaignIdContext.Provider value={superCampaignId}>
      {children}
    </SuperCampaignIdContext.Provider>
  )
}

export default SuperCampaignIdProvider
