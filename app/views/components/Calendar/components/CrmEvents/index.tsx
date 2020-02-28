import React from 'react'

import { EventDrawer } from 'components/EventDrawer'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'

import { createDueDate } from './helpers/create-date'

interface Props {
  isEventDrawerOpen: boolean
  event?: ICalendarEvent
  user: IUser
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
      dueDate: createDueDate(new Date()),
      reminder: {
        title: 'None',
        value: -1
      },
      task_type: { title: 'Call', value: 'Call' }
    }

    return <EventDrawer {...sharedProps} initialValues={initialValues} />
  }

  const id =
    props.event.object_type === 'crm_association'
      ? props.event.crm_task
      : props.event.id

  if (props.event.event_type === 'Open House') {
    // @ts-ignore js component
    return <OpenHouseDrawer {...sharedProps} openHouseId={id} />
  }

  if (props.event.event_type === 'Tour') {
    return <TourDrawer {...sharedProps} tourId={id} />
  }

  return <EventDrawer {...sharedProps} eventId={id} />
}
