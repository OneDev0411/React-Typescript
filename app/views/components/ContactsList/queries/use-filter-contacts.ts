import { useQuery } from '@app/hooks/query'
import { searchContacts } from '@app/models/contacts/search-contacts'

import { contactsFilter } from './keys'

export function useFilterContacts(criteria: string) {
  const { data: body, ...rest } = useQuery(
    contactsFilter(criteria),
    () => searchContacts(criteria),
    {
      enabled: criteria.length > 2
    }
  )

  return {
    data: body ? body.data : [],
    ...rest
  }
}
