import { Dispatch, SetStateAction, useCallback, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getSuperCampaign from '@app/models/super-campaign/get-super-campaign'

import { useRefreshSuperCampaignBasedOnDueAt } from './use-refresh-super-campaign-based-on-due-at'

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

  const loadSuperCampaign = useCallback(
    () => run(async () => getSuperCampaign(superCampaignId)),
    [run, superCampaignId]
  )

  useEffect(() => {
    loadSuperCampaign()
  }, [loadSuperCampaign])

  useRefreshSuperCampaignBasedOnDueAt(superCampaign, loadSuperCampaign)

  return { isLoading, superCampaign, setSuperCampaign }
}
