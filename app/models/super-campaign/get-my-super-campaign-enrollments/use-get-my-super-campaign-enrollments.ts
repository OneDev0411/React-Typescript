import { UseQueryResult } from 'react-query'

import { useQuery } from '@app/hooks/query'

import { myList } from '../query-keys/enrollment'

import { getMySuperCampaignEnrollments } from './get-my-super-campaign-enrollments'

export type UseGetMySuperCampaignEnrollments = UseQueryResult<
  ISuperCampaignEnrollment[]
>

// eslint-disable-next-line max-len
export function useGetMySuperCampaignEnrollments(): UseGetMySuperCampaignEnrollments {
  return useQuery(myList(), getMySuperCampaignEnrollments)
}
