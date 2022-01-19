import { UseQueryResult } from 'react-query'

import { useQuery } from '@app/hooks/query'

import { getAllSuperCampaignEnrollments } from './get-all-super-campaign-enrollments'
import { allList } from './query-keys/enrollment'

export type SuperCampaignEnrollmentItem =
  | ISuperCampaignEnrollment<'user' | 'brand'>
  | ISuperCampaignEnrollment<'user' | 'brand' | 'campaign'>

type UseGetAllSuperCampaignEnrollments = UseQueryResult<
  SuperCampaignEnrollmentItem[]
>

export function useGetAllSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: boolean
): UseGetAllSuperCampaignEnrollments {
  return useQuery<SuperCampaignEnrollmentItem[]>(
    allList(superCampaignId, includeCampaign),
    async () => getAllSuperCampaignEnrollments(superCampaignId, includeCampaign)
  )
}
