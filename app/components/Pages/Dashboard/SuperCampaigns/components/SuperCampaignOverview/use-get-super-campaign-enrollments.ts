import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getSuperCampaignEnrollments from '@app/models/super-campaign/get-super-campaign-enrollments'

export type SuperCampaignEnrollmentItem =
  | ISuperCampaignEnrollment<'user_and_brand'>
  | ISuperCampaignEnrollment<'user_and_brand_and_campaign'>

interface UseGetSuperCampaignEnrollments {
  isLoading: boolean
  superCampaignEnrollments: SuperCampaignEnrollmentItem[]
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<SuperCampaignEnrollmentItem[]>
  >
  superCampaignEnrollmentCount: number
}

export function useGetSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: boolean
): UseGetSuperCampaignEnrollments {
  const {
    run,
    data: superCampaignEnrollments,
    setData: setSuperCampaignEnrollments,
    isLoading
  } = useAsync<SuperCampaignEnrollmentItem[]>({
    data: [],
    status: 'pending'
  })

  useEffect(() => {
    run(async () =>
      getSuperCampaignEnrollments(superCampaignId, includeCampaign)
    )
  }, [run, superCampaignId, includeCampaign])

  return {
    isLoading,
    superCampaignEnrollments,
    setSuperCampaignEnrollments,
    superCampaignEnrollmentCount: superCampaignEnrollments.length
  }
}
