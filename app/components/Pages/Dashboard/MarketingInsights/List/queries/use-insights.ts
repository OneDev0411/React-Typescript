import { useMemo } from 'react'

import { useActiveBrandId } from '@app/hooks/brand'
import { useInfiniteQuery } from '@app/hooks/query'
import { getEmailCampaigns } from 'models/email/get-email-campaigns'

import { EmailCampaignStatus } from '../../types'

import { list } from './keys'

const LIMIT = 50

export function useInsights(
  status: EmailCampaignStatus,
  sortBy = '-created_at',
  limit = LIMIT
) {
  const activeBrandId = useActiveBrandId()

  const { data, ...params } = useInfiniteQuery(
    list(status, sortBy),
    ({ pageParam = 0 }) => {
      return getEmailCampaigns(activeBrandId, {
        start: pageParam,
        limit,
        status,
        order: sortBy,
        associations: {
          associations: ['template'],
          recipientsAssociations: [],
          emailsAssociations: []
        }
      })
    },
    {
      enabled: !!status,
      getNextPageParam: (lastPage, pages) => {
        const total = lastPage.info?.total ?? 0
        const nextOffset = pages.length * LIMIT

        return nextOffset < total ? nextOffset : undefined
      }
    }
  )

  const flattedList = useMemo(
    () =>
      data?.pages.flatMap(page => page.data) as IEmailCampaign<'template'>[],
    [data?.pages]
  )

  return {
    ...params,
    total: data?.pages[0].info?.total ?? 0,
    list: flattedList
  }
}
