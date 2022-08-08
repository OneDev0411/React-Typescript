import { useMemo } from 'react'

import { useInfiniteQuery } from '@app/hooks/query'
import { getContacts } from 'models/contacts/get-contacts'

import { contactsList } from './keys'

const LIMIT = 200

export function useContactsList() {
  const { data, ...rest } = useInfiniteQuery(
    contactsList(),
    ({ pageParam = 0 }) => getContacts(pageParam, LIMIT),
    {
      getNextPageParam: (lastPage, pages) => {
        const { total } = lastPage.info
        const nextOffset = pages.length * LIMIT

        return nextOffset < total ? nextOffset : undefined
      }
    }
  )

  const contacts = useMemo(
    () => data?.pages.flatMap(page => page.data) as IContact[],
    [data?.pages]
  )

  return {
    data,
    contacts,
    ...rest
  }
}
