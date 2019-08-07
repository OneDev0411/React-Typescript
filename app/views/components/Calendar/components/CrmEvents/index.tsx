import React from 'react'

import { TourDrawer } from 'components/tour/TourDrawer'
import { EventDrawer } from 'components/EventDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

interface Props {
  isEventDrawerOpen: boolean
  event?: ICalendarEvent
  user: IUser
  selectedDate?: Date | null
  onEventChange(event: IEvent, type: string): void
  onCloseEventDrawer(): void
}

export function CrmEvents(props: Props) {
  if (!props.isEventDrawerOpen) {
    return null
  }

  const sharedProps = {
    isOpen: true,
    deleteCallback: (event: IEvent) => props.onEventChange(event, 'deleted'),
    onClose: props.onCloseEventDrawer,
    submitCallback: props.onEventChange,
    user: props.user,
    defaultSelectedDate: props.selectedDate
  }

  if (!props.event) {
    return <EventDrawer {...sharedProps} />
  }

  if (props.event.type === 'Tour') {
    return <TourDrawer {...sharedProps} tourId={props.event.id} />
  }

  if (props.event.type === 'Open House') {
    return <OpenHouseDrawer {...sharedProps} openHouseId={props.event.id} />
  }

  return <EventDrawer {...sharedProps} eventId={props.event.id} />
}
