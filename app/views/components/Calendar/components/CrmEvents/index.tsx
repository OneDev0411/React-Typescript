import React from 'react'

import { EventDrawer } from 'components/EventDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'

import { createDueDate } from './helpers'

interface Props {
  isEventDrawerOpen: boolean
  event?: ICalendarEvent
  user: IUser
  selectedDate: Date
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
    user: props.user
  }

  if (!props.event) {
    const initialValues = {
      assignees: [props.user],
      associations: [],
      dueDate: createDueDate(props.selectedDate),
      reminder: {
        title: 'None',
        value: -1
      },
      task_type: { title: 'Call', value: 'Call' }
    }

    return <EventDrawer {...sharedProps} initialValues={initialValues} />
  }

  if (props.event.type === 'Open House') {
    return <OpenHouseDrawer {...sharedProps} openHouseId={props.event.id} />
  }

  return <EventDrawer {...sharedProps} eventId={props.event.id} />
}
