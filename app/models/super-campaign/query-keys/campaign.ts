import { QueryKey } from 'react-query'

const TYPE = 'super_campaign'

export function getAll(order?: string[]): QueryKey {
  if (!order) {
    return [TYPE, 'getAll']
  }

  return [TYPE, 'getAll', { order }]
}

export function getOne(id: UUID): QueryKey {
  return [TYPE, 'getOne', id]
}
