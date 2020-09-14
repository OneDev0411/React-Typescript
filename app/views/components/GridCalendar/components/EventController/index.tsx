import React from 'react'

import ContactFlow from 'components/InstantMarketing/adapters/SendContactCard'

import { goTo } from 'utils/go-to'
import { CrmEventType } from 'components/Calendar/types'

import { CrmEvents } from '../../../Calendar/components/CrmEvents'
import {
  isCRMEvent,
  isDealEvent,
  isCelebrationEvent
} from '../../helpers/normalize-events/helpers/event-checker'

interface Props {
  user: IUser
  event: ICalendarEvent | null
  day: Date | null
  onEventChange(event: IEvent, type: CrmEventType): void
  setSelectedEvent(event: ICalendarEvent | null): void
  setSelectedDay(event: Date | null): void
}

export const EventController = ({
  user,
  day,
  event,
  setSelectedEvent,
  setSelectedDay,
  onEventChange
}: Props) => {
  const crmDrawerConditionOnClick = event && isCRMEvent(event)
  const crmDrawerPropsOnClick = crmDrawerConditionOnClick ? { event } : {}
  const createEventOnDayProps = day ? { initialDueDate: day } : {}

  const EventDrawer = (crmDrawerConditionOnClick || day) && (
    <CrmEvents
      isEventDrawerOpen
      user={user}
      onEventChange={onEventChange}
      onCloseEventDrawer={() => {
        setSelectedEvent(null)
        setSelectedDay(null)
      }}
      {...crmDrawerPropsOnClick}
      {...createEventOnDayProps}
    />
  )

  const McBuilder = event && isCelebrationEvent(event) && (
    <ContactFlow
      handleTrigger={() => setSelectedEvent(null)}
      isBuilderOpen
      hasExternalTrigger
      contact={event?.people![0] as IContact}
      mediums="Email"
      types={['Birthday', 'HomeAnniversary']}
    />
  )

  if (event?.object_type === 'contact' && event?.event_type === 'next_touch') {
    goTo(`/dashboard/contacts/${event.contact}`)

    return null
  }

  if (event && isDealEvent(event)) {
    goTo(`/dashboard/deals/${event.deal}`)

    return null
  }

  return (
    <>
      {EventDrawer}
      {McBuilder}
    </>
  )
}
