import { useQuery } from 'hooks/query'

import * as keys from '../query-keys/contact'

import { getContact } from './index'

async function queryFn<T extends TContactAssociation>(
  id: UUID,
  associations: T[]
): Promise<IContactWithAssoc<T>> {
  const resp = await getContact(id, { associations })

  return resp.data
}

export function useContact<T extends TContactAssociation>(
  id: UUID,
  associations: T[]
) {
  return useQuery(keys.byId(id), () => queryFn(id, associations))
}
