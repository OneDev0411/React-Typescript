import { Dispatch, SetStateAction } from 'react'

type UseDeleteAdminSuperCampaigns = (superCampaignId: UUID) => void

export function useDeleteAdminSuperCampaigns(
  setSuperCampaigns: Dispatch<SetStateAction<ISuperCampaign[]>>
): UseDeleteAdminSuperCampaigns {
  return (superCampaignId: UUID) =>
    setSuperCampaigns(superCampaigns =>
      superCampaigns.filter(
        superCampaign => superCampaign.id !== superCampaignId
      )
    )
}
