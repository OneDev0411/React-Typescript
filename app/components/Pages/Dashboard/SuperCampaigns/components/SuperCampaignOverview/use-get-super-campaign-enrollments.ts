import { Dispatch, SetStateAction, useEffect } from 'react'

import useAsync from '@app/hooks/use-async'
import getSuperCampaignEnrollments from '@app/models/super-campaign/get-super-campaign-enrollments'

interface UseGetSuperCampaignEnrollments {
  isLoading: boolean
  superCampaignEnrollments: ISuperCampaignEnrollment<'user_and_brand'>[]
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<ISuperCampaignEnrollment<'user_and_brand'>[]>
  >
  superCampaignEnrollmentCount: number
}

export function useGetSuperCampaignEnrollments(
  superCampaignId: UUID
): UseGetSuperCampaignEnrollments {
  const {
    run,
    data: superCampaignEnrollments,
    setData: setSuperCampaignEnrollments,
    isLoading
  } = useAsync<ISuperCampaignEnrollment<'user_and_brand'>[]>({
    data: [],
    status: 'pending'
  })

  useEffect(() => {
    run(async () => getSuperCampaignEnrollments(superCampaignId))
  }, [run, superCampaignId])

  return {
    isLoading,
    superCampaignEnrollments,
    setSuperCampaignEnrollments,
    superCampaignEnrollmentCount: superCampaignEnrollments.length
  }
}
