import React from 'react'

import { isFuture, isToday } from 'date-fns'

import { DONE_STATUS } from '@app/views/components/EventDrawer/components/FutureEventDoneConfirmation'
import { EventDrawer } from 'components/EventDrawer'
import { initialValueGenerator } from 'components/EventDrawer/helpers/initial-value-generator'
import { OpenHouseDrawer } from 'components/open-house/OpenHouseDrawer'
import { TourDrawer } from 'components/tour/TourDrawer'

interface Props {
  isEventDrawerOpen: boolean
  event?: ICalendarEvent | null
  initialDueDate?: Date
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
    // Change status and drawer title based on initialDueDate
    const isInFuture =
      props.initialDueDate &&
      isFuture(props.initialDueDate) &&
      !isToday(props.initialDueDate)

    const initialValues = initialValueGenerator(
      props.user,
      [],
      props.initialDueDate
    )

    const title = isInFuture ? 'Add Reminder' : 'Log Activity'

    return (
      <EventDrawer
        {...sharedProps}
        initialValues={
          isInFuture ? initialValues : { ...initialValues, status: DONE_STATUS }
        }
        title={title}
      />
    )
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
