import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getSuperCampaign from '@app/models/super-campaign/get-super-campaign'

interface UseGetSuperCampaign {
  isLoading: boolean
  superCampaign: Nullable<ISuperCampaign<'template_instance'>>
  setSuperCampaign: Dispatch<
    SetStateAction<Nullable<ISuperCampaign<'template_instance'>>>
  >
}

export function useGetSuperCampaign(
  superCampaignId: UUID
): UseGetSuperCampaign {
  const {
    run,
    data: superCampaign,
    setData: setSuperCampaign,
    isLoading
  } = useAsync<Nullable<ISuperCampaign<'template_instance'>>>({
    data: null,
    status: 'pending'
  })

  useEffect(() => {
    run(async () => getSuperCampaign(superCampaignId))
  }, [run, superCampaignId])

  return { isLoading, superCampaign, setSuperCampaign }
}
