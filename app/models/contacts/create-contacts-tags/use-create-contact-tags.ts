import { useMutation } from '@app/hooks/query'

import * as keys from '../query-keys/tag'

import { createContactsTags } from './index'

async function mutateFn(tag: string): Promise<IContactTag> {
  const resp = await createContactsTags(tag)

  return resp.data
}

export function useCreateContactTags() {
  return useMutation(mutateFn, {
    invalidates: [keys.list()]
  })
}
