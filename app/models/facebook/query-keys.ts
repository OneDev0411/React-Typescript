import { QueryKey } from 'react-query'

const TYPE = 'facebook_page'

export function all(): QueryKey {
  return [TYPE]
}

export function list(): QueryKey {
  return [...all(), 'list']
}
