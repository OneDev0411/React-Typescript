import React from 'react'

import { TourDrawer } from 'components/tour/TourDrawer'
import { EventDrawer } from 'components/EventDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

export function CrmEvents(props) {
  const { selectedEvent, isOpen } = props

  if (!isOpen) {
    return null
  }

  const sharedProps = {
    deleteCallback: props.submitCallback,
    isOpen: true,
    onClose: props.onClose,
    submitCallback: props.submitCallback,
    user: props.user
  }

  // New Event
  if (!selectedEvent) {
    return <EventDrawer {...sharedProps} />
  }

  const { id } = selectedEvent

  switch (selectedEvent.task_type) {
    case 'Tour':
      return <TourDrawer {...sharedProps} tourId={id} />
    case 'Open House':
      return <OpenHouseDrawer {...sharedProps} openHouseId={id} />
    default:
      return <EventDrawer {...sharedProps} eventId={id} />
  }
}
