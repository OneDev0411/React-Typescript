import { useEffect, useState } from 'react'

import { searchContacts } from '@app/models/contacts/search-contacts'

export function useRoleContacts(role: Nullable<IDealRole>) {
  const [contacts, setContacts] = useState<Nullable<IContact[]>>(null)
  const email = role?.email

  useEffect(() => {
    if (!email) {
      return
    }

    const fetch = async () => {
      try {
        const { data } = await searchContacts(email)

        setContacts(data)
      } catch (e) {
        setContacts(null)
      }
    }

    fetch()
  }, [email])

  return contacts
}
