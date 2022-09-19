import { useQuery } from '@app/hooks/query'
import { searchContacts } from '@app/models/contacts/search-contacts'

import { all } from './keys'

export function useSearchContacts(criteria: string) {
  const { data: body, ...resp } = useQuery(
    all(criteria),
    () => searchContacts(criteria),
    {
      enabled: criteria.length > 3
    }
  )

  return {
    data: body ? body.data : [],
    ...resp
  }
}
