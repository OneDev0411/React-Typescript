import { useActiveBrandId } from '@app/hooks/brand'
import { useInfiniteQuery } from '@app/hooks/query'
import { getEmailCampaigns } from 'models/email/get-email-campaigns'

import { all } from './keys'

const LIMIT = 100

export function useInsights() {
  const activeBrandId = useActiveBrandId()

  const { data, ...params } = useInfiniteQuery(
    all(),
    ({ pageParam = 0 }) =>
      getEmailCampaigns(activeBrandId, {
        start: 0,
        limit: 50,
        associations: {
          emailCampaignAssociations: ['template'],
          emailRecipientsAssociations: [],
          emailCampaignEmailsAssociation: []
        }
      }),
    {
      getNextPageParam: (lastPage, pages) => {
        const total = lastPage.info?.total ?? 0
        const nextOffset = pages.length * LIMIT

        return nextOffset < total ? nextOffset : undefined
      }
    }
  )

  return {
    ...params,
    list: data
  }
}
