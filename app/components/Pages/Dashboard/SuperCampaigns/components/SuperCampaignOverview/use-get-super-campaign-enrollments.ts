import { Dispatch, SetStateAction, useMemo } from 'react'

import { useDeepCompareEffect } from 'react-use'

import useAsync from '@app/hooks/use-async'
import getSuperCampaignEnrollments from '@app/models/super-campaign/get-super-campaign-enrollments'

export type SuperCampaignEnrollmentItem =
  | ISuperCampaignEnrollment<'user' | 'brand'>
  | ISuperCampaignEnrollment<'user' | 'brand' | 'campaign'>

interface UseGetSuperCampaignEnrollments {
  isLoading: boolean
  superCampaignEnrollments: SuperCampaignEnrollmentItem[]
  setSuperCampaignEnrollments: Dispatch<
    SetStateAction<SuperCampaignEnrollmentItem[]>
  >
  enrolledAgentCount: number
}

export function useGetSuperCampaignEnrollments(
  superCampaignId: UUID,
  superCampaignTags: Nullable<string[]>,
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

  useDeepCompareEffect(() => {
    run(async () =>
      getSuperCampaignEnrollments(superCampaignId, includeCampaign)
    )
  }, [run, superCampaignId, includeCampaign, superCampaignTags])

  // Count the number of non-opted-out people
  const enrolledAgentCount = useMemo(
    () =>
      superCampaignEnrollments.filter(
        superCampaignEnrollment => !superCampaignEnrollment.deleted_at
      ).length,
    [superCampaignEnrollments]
  )

  return {
    isLoading,
    superCampaignEnrollments,
    setSuperCampaignEnrollments,
    enrolledAgentCount
  }
}
