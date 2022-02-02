import { useQuery } from '@app/hooks/query'

import { list } from '../query-keys/attribute-def'

import { getAttributeDefs } from '.'

export function useAttributeDefs() {
  return useQuery(list(), getAttributeDefs, {
    staleTime: Infinity,
    cacheTime: Infinity
  })
}
