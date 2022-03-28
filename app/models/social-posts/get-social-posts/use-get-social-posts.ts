import { UseInfiniteQueryResult } from 'react-query'

import { useInfiniteQuery } from '@app/hooks/query'

import { filteredList } from '../query-keys'
import { GetSocialPostFilter, UseGetSocialPostsFilter } from '../types'

import { getGetSocialPosts } from './get-social-posts'

const numberOfItemsInRequest: number = 50
const initialRange: GetSocialPostFilter = {
  start: 0,
  limit: numberOfItemsInRequest
}

export function useGetSocialPosts(
  brandId: UUID,
  filter: UseGetSocialPostsFilter = { executed: 'true' }
): UseInfiniteQueryResult<ISocialPost<'template_instance' | 'owner'>[]> {
  return useInfiniteQuery(
    filteredList(brandId, filter),
    async ({ pageParam }: { pageParam?: GetSocialPostFilter }) => {
      return getGetSocialPosts(brandId, {
        ...filter,
        ...(pageParam ?? initialRange)
      })
    },
    {
      getNextPageParam: (_, pages): GetSocialPostFilter => {
        return {
          start: pages.length * numberOfItemsInRequest,
          limit: numberOfItemsInRequest
        }
      }
    }
  )
}
