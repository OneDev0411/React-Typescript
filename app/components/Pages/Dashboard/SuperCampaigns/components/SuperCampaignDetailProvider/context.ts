import { createContext, Dispatch, SetStateAction } from 'react'

export const SuperCampaignDetailContext = createContext<
  Optional<{
    superCampaign: ISuperCampaign<'template_instance'>
    setSuperCampaign: Dispatch<
      SetStateAction<ISuperCampaign<'template_instance'>>
    >
  }>
>(undefined)
