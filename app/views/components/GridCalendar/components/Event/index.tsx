import React, { useState, useMemo } from 'react'
import { EventContentArg } from '@fullcalendar/react'
import { Popover } from '@material-ui/core'

import { eventTypesIcons as eventIcons } from 'views/utils/event-types-icons'
import { importantDatesIcons as contactIcons } from 'views/utils/important-dates-icons'

import {
  isDealEvent,
  isCelebrationEvent
} from '../../helpers/normalize-events/helpers/event-checker'

import { GeneralEvent } from './components/General'
import { CelebrationEvent } from './components/Celebration'
import { DealEvent } from './components/Deal'
import { usePopoverStyles } from './use-style'

import { getFormatDate } from './helper/get-format-date'

export interface BaseEventProps {
  event: EventContentArg
  rowEvent: ICalendarEvent
  handleShowDetails: (e: React.MouseEvent<HTMLDivElement>) => void
}

type EventsType = {
  component({
    event,
    rowEvent,
    handleShowDetails
  }: BaseEventProps): React.ReactElement<any> | null
  condition(event: EventContentArg, rowEvent: ICalendarEvent): boolean
}

const events: EventsType[] = [
  {
    component: CelebrationEvent,
    condition: (event: EventContentArg, rowEvent: ICalendarEvent) =>
      isCelebrationEvent(rowEvent)
  },
  {
    component: DealEvent,
    condition: (event: EventContentArg, rowEvent: ICalendarEvent) =>
      isDealEvent(rowEvent)
  },
  {
    component: GeneralEvent,
    condition: (event: EventContentArg, rowEvent: ICalendarEvent) =>
      ['crm_task', 'crm_association'].includes(rowEvent.object_type)
  }
]

export const Event = (props: Pick<BaseEventProps, 'event' | 'rowEvent'>) => {
  const { rowEvent } = props
  const popoverClasses = usePopoverStyles()
  const [anchorEl, setAnchorEl] = useState<HTMLDivElement | null>(null)

  const handleShowDetails = (event: React.MouseEvent<HTMLDivElement>) => {
    setAnchorEl(event.currentTarget)
  }

  const handleCloseDetails = () => {
    setAnchorEl(null)
  }
  const open = Boolean(anchorEl)
  const id = open ? 'event-popover' : undefined

  const eventItem = events.find(item => item.condition(props.event, rowEvent))

  const icon = useMemo(() => {
    if (rowEvent.object_type === 'contact_attribute') {
      if (contactIcons[rowEvent.type_label]) {
        return contactIcons[rowEvent.type_label]
      }

      if (
        rowEvent.type === 'birthday' ||
        rowEvent.event_type === 'child_birthday'
      ) {
        return contactIcons.Birthday
      }
    }

    if (isDealEvent(rowEvent)) {
      return eventIcons['Task Critical']
    }

    if (eventIcons[rowEvent.event_type]) {
      return eventIcons[rowEvent.event_type]
    }

    if (rowEvent.event_type === 'Message') {
      return eventIcons.Mail
    }

    return eventIcons.Other
  }, [rowEvent])

  if (!eventItem) {
    return null
  }

  return (
    <>
      <eventItem.component {...props} handleShowDetails={handleShowDetails} />
      <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleCloseDetails}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center'
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center'
        }}
      >
        <div className={popoverClasses.container}>
          <div className={popoverClasses.body}>
            <div className={popoverClasses.icon}>
              <icon.icon />
            </div>
            <div className={popoverClasses.details}>
              <span className={popoverClasses.eventTitle}>
                {props.event.event.title}
              </span>
              <span className={popoverClasses.eventDate}>
                {getFormatDate(rowEvent)}
              </span>
            </div>
          </div>
        </div>
      </Popover>
    </>
  )
}
