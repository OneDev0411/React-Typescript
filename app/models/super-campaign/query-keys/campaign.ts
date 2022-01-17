import { QueryKey } from 'react-query'

const TYPE = 'super_campaign'

export function all(): QueryKey {
  return [TYPE]
}

export function lists(): QueryKey {
  return [...all(), 'list']
}

export function list(order?: string[]): QueryKey {
  if (!order) {
    return [...lists()]
  }

  return [...lists(), { order }]
}

export function details(): QueryKey {
  return [...all(), 'detail']
}

export function detail(id: UUID): QueryKey {
  return [...details(), id]
}
