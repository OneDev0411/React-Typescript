import { useQuery } from 'hooks/query'

import * as keys from '../query-keys/tag'

import { getContactsTags } from './index'

async function queryFn(): Promise<IContactTag[]> {
  const resp = await getContactsTags()

  return resp.data
}

/**
 * Since contact tags are rarely changed, but can be accessed spontaneously, we
 * make this hook to always keep the cache, until it is invalidated manually.
 */
export function useContactTags() {
  return useQuery(keys.list(), queryFn, {
    staleTime: Infinity,
    cacheTime: Infinity
  })
}
