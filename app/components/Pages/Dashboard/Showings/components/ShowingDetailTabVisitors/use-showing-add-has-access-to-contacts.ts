import { useMemo } from 'react'

import { IContactWithAccess } from './types'

function useShowingAddHasAccessToContacts(
  appointments: IShowingAppointment<'showing'>[],
  contacts: IContact[]
): IContactWithAccess[] {
  return useMemo(() => {
    const appointmentsContacts: IContact[] =
      appointments?.map(appointment => appointment?.contact) || []

    const uniqueAppointmentsContacts: IContact[] = [
      ...new Set(appointmentsContacts.map(item => item))
    ]

    return uniqueAppointmentsContacts?.map(item => {
      return {
        ...item,
        hasAccessToContact: contacts?.some(contact => contact.id === item.id)
      }
    })
  }, [appointments, contacts])
}

export default useShowingAddHasAccessToContacts
