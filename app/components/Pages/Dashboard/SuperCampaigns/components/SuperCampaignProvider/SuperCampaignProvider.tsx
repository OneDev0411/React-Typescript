import { ReactNode } from 'react'

import { SuperCampaignDetailContext } from './context'

interface SuperCampaignDetailProviderProps {
  superCampaign: ISuperCampaign<'template_instance'>
  children: ReactNode
}

function SuperCampaignDetailProvider({
  superCampaign,
  children
}: SuperCampaignDetailProviderProps) {
  return (
    <SuperCampaignDetailContext.Provider value={superCampaign}>
      {children}
    </SuperCampaignDetailContext.Provider>
  )
}

export default SuperCampaignDetailProvider
