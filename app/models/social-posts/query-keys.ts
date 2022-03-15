import { QueryKey } from 'react-query'

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
