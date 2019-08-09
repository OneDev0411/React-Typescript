import React from 'react'

import { TourDrawer } from 'components/tour/TourDrawer'
import { EventDrawer } from 'components/EventDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

export function CrmEvents(props) {
  const { selectedEvent, isEventDrawerOpen } = props

  if (!isEventDrawerOpen) {
    return null
  }

  const sharedProps = {
    deleteCallback: props.onEventChange,
    isOpen: true,
    onClose: props.onCloseEventDrawer,
    submitCallback: props.onEventChange,
    user: props.user
  }

  // New Event
  if (!selectedEvent) {
    return <EventDrawer {...sharedProps} />
  }

  const { id } = selectedEvent

  switch (selectedEvent.type) {
    case 'Tour':
      return <TourDrawer {...sharedProps} tourId={id} />
    case 'Open House':
      return <OpenHouseDrawer {...sharedProps} openHouseId={id} />
    default:
      return <EventDrawer {...sharedProps} eventId={id} />
  }
}
