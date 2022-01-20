import { Dispatch, ReactNode, SetStateAction } from 'react'

import { SuperCampaignDetailContext } from './context'

interface SuperCampaignDetailProviderProps {
  superCampaign: ISuperCampaign<'template_instance'>
  setSuperCampaign: Dispatch<
    SetStateAction<ISuperCampaign<'template_instance'>>
  >
  children: ReactNode
}

function SuperCampaignDetailProvider({
  superCampaign,
  setSuperCampaign,
  children
}: SuperCampaignDetailProviderProps) {
  const contextValue = {
    superCampaign,
    setSuperCampaign
  }

  return (
    <SuperCampaignDetailContext.Provider value={contextValue}>
      {children}
    </SuperCampaignDetailContext.Provider>
  )
}

export default SuperCampaignDetailProvider
