import { QueryKey } from 'react-query'

const TYPE = 'super_campaign'

export function all(): QueryKey {
  return [TYPE]
}

export function lists(): QueryKey {
  return [...all(), 'list']
}

export function allList(order?: string[]): QueryKey {
  if (!order) {
    return [...lists(), 'all']
  }

  return [...lists(), 'all', { order }]
}

export function details(): QueryKey {
  return [...all(), 'detail']
}

export function detail(id: UUID): QueryKey {
  return [...details(), id]
}

export function myList(limit?: number): QueryKey {
  if (!limit) {
    return [...lists(), 'my']
  }

  return [...lists(), 'my', { limit }]
}
