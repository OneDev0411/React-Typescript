import { QueryKey } from 'react-query'

import { UseGetSocialPostsFilter } from './types'

const TYPE = 'social_post'

export function all(): QueryKey {
  return [TYPE]
}

export function lists(): QueryKey {
  return [...all(), 'list']
}

export function list(brandId: UUID): QueryKey {
  return [...lists(), brandId]
}

export function filteredList(
  brandId: UUID,
  filter: UseGetSocialPostsFilter
): QueryKey {
  return [...list(brandId), filter]
}
