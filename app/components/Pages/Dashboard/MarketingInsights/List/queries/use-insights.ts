import { useMemo } from 'react'

import { useActiveBrandId } from '@app/hooks/brand'
import { useInfiniteQuery } from '@app/hooks/query'
import { getEmailCampaigns } from 'models/email/get-email-campaigns'

import { useInsightsContext } from '../../context/use-insights-context'

import { allLists } from './keys'

const LIMIT = 30

export function useInsights() {
  const activeBrandId = useActiveBrandId()
  const { status } = useInsightsContext()

  const { data, ...params } = useInfiniteQuery(
    allLists(status),
    ({ pageParam = 0 }) => {
      return getEmailCampaigns(activeBrandId, {
        start: pageParam,
        limit: LIMIT,
        status,
        associations: {
          associations: ['template'],
          recipientsAssociations: [],
          emailsAssociations: []
        }
      })
    },
    {
      getNextPageParam: (lastPage, pages) => {
        const total = lastPage.info?.total ?? 0
        const nextOffset = pages.length * LIMIT

        return nextOffset < total ? nextOffset : undefined
      }
    }
  )

  const list = useMemo(
    () =>
      data?.pages.flatMap(page => page.data) as IEmailCampaign<'template'>[],
    [data?.pages]
  )

  return {
    ...params,
    list
  }
}
