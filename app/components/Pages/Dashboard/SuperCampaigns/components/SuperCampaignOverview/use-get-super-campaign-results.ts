import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getSuperCampaignResults from '@app/models/super-campaign/get-super-campaign-results'

interface UseGetSuperCampaignResults {
  isLoading: boolean
  superCampaignResults: ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]
  setSuperCampaignResults: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]>
  >
  superCampaignResultCount: number
}

export function useGetSuperCampaignResults(
  superCampaignId: UUID
): UseGetSuperCampaignResults {
  const {
    run,
    data: superCampaignResults,
    setData: setSuperCampaignResults,
    isLoading
  } = useAsync<ISuperCampaignEnrollment<'user_and_brand_and_campaign'>[]>({
    data: [],
    status: 'pending'
  })

  useEffect(() => {
    run(async () => getSuperCampaignResults(superCampaignId))
  }, [run, superCampaignId])

  return {
    isLoading,
    superCampaignResults,
    setSuperCampaignResults,
    superCampaignResultCount: superCampaignResults.length
  }
}
