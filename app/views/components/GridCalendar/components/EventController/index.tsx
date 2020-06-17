import React from 'react'

import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'

import { CrmEvents } from '../../../Calendar/components/CrmEvents'

interface Props {
  user: IUser
  event: ICalendarEvent | null
  onEventChange(event: IEvent, type: string): void
  setSelectedEvent(event: ICalendarEvent | null): void
}

export const EventController = ({
  user,
  event,
  setSelectedEvent,
  onEventChange
}: Props) => {
  const EventDrawer =
    event && ['crm_task', 'crm_association'].includes(event.object_type) ? (
      <CrmEvents
        isEventDrawerOpen
        event={event}
        user={user}
        onEventChange={onEventChange}
        onCloseEventDrawer={() => setSelectedEvent(null)}
      />
    ) : null

  const McBuilder =
    event?.event_type &&
    ['home_anniversary', 'birthday'].includes(event.event_type) ? (
      <ContactFlow
        handleTrigger={() => setSelectedEvent(null)}
        isBuilderOpen
        hasExternalTrigger
        contact={event?.people![0] as IContact}
        mediums="Email"
        types={['Birthday']}
      />
    ) : null

  if (event?.object_type === 'contact' && event?.event_type === 'next_touch') {
    window.open(`/dashboard/contacts/${event.contact}`, '_blank')

    return null
  }

  if (
    event?.object_type === 'deal_context' &&
    [
      'list_date',
      'expiration_date',
      'contract_date',
      'inspection_date',
      'option_period',
      'financing_due',
      'title_due',
      't47_due',
      'closing_date',
      'possession_date',
      'lease_executed',
      'lease_application_date',
      'lease_begin',
      'lease_end'
    ].includes(event?.event_type)
  ) {
    window.open(`/dashboard/deals/${event.deal}`)

    return null
  }

  return (
    <>
      {EventDrawer}
      {McBuilder}
    </>
  )
}
