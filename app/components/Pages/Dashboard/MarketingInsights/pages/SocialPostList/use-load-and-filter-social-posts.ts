import { useMemo } from 'react'

import { useActiveBrandId } from '@app/hooks/brand'
import { useGetSocialPosts } from '@app/models/social-posts'

import { isSocialPostFailed, isSocialPostFilterValid } from './helpers'
import { SocialPostFilter } from './types'

const defaultSocialPosts: ISocialPost<'template_instance' | 'owner'>[] = []

interface UseLoadAndFilterSocialPosts
  extends Pick<
    ReturnType<typeof useGetSocialPosts>,
    'isFetching' | 'fetchNextPage'
  > {
  filteredSocialPosts: ISocialPost<'template_instance' | 'owner'>[]
  filter: SocialPostFilter
}

export function useLoadAndFilterSocialPosts(
  filterRaw: string
): UseLoadAndFilterSocialPosts {
  const filter: SocialPostFilter = isSocialPostFilterValid(filterRaw)
    ? filterRaw
    : 'posted'

  const activeBrandId = useActiveBrandId()
  const { isFetching, data, fetchNextPage } = useGetSocialPosts(activeBrandId, {
    executed: filter === 'scheduled' ? 'false' : 'true'
  })

  const socialPosts = data?.pages.flat() || defaultSocialPosts

  /**
   * The scheduled items are fine because the API returns just the needed data.
   * But when it comes to the posted and failed items, we need to filter the results
   * to find them.
   */
  const filteredSocialPosts = useMemo<
    ISocialPost<'template_instance' | 'owner'>[]
  >(() => {
    if (filter === 'scheduled') {
      return socialPosts
    }

    // Returns only the failed items
    if (filter === 'failed') {
      return socialPosts.filter(isSocialPostFailed)
    }

    // Returns the posted items which are not failed
    return socialPosts.filter(socialPost => !isSocialPostFailed(socialPost))
  }, [filter, socialPosts])

  return { filteredSocialPosts, isFetching, fetchNextPage, filter }
}
