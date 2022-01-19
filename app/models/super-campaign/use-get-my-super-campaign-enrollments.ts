import { UseQueryResult } from 'react-query'

import { useQuery } from '@app/hooks/query'

import { getMySuperCampaignEnrollments } from './get-my-super-campaign-enrollments'
import { myList } from './query-keys/enrollment'

export type UseGetMySuperCampaignEnrollments = UseQueryResult<
  ISuperCampaignEnrollment[]
>

// eslint-disable-next-line max-len
export function useGetMySuperCampaignEnrollments(): UseGetMySuperCampaignEnrollments {
  return useQuery(myList(), getMySuperCampaignEnrollments)
}
