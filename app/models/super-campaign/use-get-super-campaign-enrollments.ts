import { UseQueryResult } from 'react-query'

import { useQuery } from '@app/hooks/query'
import { getSuperCampaignEnrollments } from '@app/models/super-campaign'

import { list } from './query-keys/enrollment'

export type SuperCampaignEnrollmentItem =
  | ISuperCampaignEnrollment<'user' | 'brand'>
  | ISuperCampaignEnrollment<'user' | 'brand' | 'campaign'>

type UseGetSuperCampaignEnrollments = UseQueryResult<
  SuperCampaignEnrollmentItem[]
>

export function useGetSuperCampaignEnrollments(
  superCampaignId: UUID,
  includeCampaign: boolean
): UseGetSuperCampaignEnrollments {
  return useQuery<SuperCampaignEnrollmentItem[]>(
    list(superCampaignId, includeCampaign),
    async () => getSuperCampaignEnrollments(superCampaignId, includeCampaign)
  )
}
