import { createContext } from 'react'

export const SuperCampaignDetailContext =
  createContext<Optional<ISuperCampaign<'template_instance'>>>(undefined)
