import React, {
  useState,
  useRef,
  useImperativeHandle,
  forwardRef,
  RefObject
} from 'react'

import { Button } from '@material-ui/core'

import { getNotes } from 'models/contacts/helpers/get-notes'

import List from 'components/Calendar'
import {
  CalendarRef,
  LoadingDirection,
  Placeholder
} from 'components/Calendar/types'

import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

import { getUpcomingInitialRange } from './helpers/get-upcoming-range'
import { getTimelineInitialRange } from './helpers/get-timeline-range'
import { convertNoteToCalendarEvent } from './helpers/convert-note-to-calendar-event'

import { Card } from '../styled'
import { Container, Title } from './styled'

export interface TimelineRef {
  refresh(): void
}

interface Props {
  contact: IContact
  timelineRef?: RefObject<TimelineRef>
}

const associations = [
  ...CRM_TASKS_QUERY.associations,
  'calendar_event.crm_task',
  'calendar_event.full_campaign',
  'calendar_event.full_crm_task'
]

function Timeline(props: Props) {
  const timelineRef = useRef<CalendarRef>(null)
  const upcomingRef = useRef<CalendarRef>(null)

  const [showUpcomingEvents, setShowUpcomingEvents] = useState<boolean>(false)

  const handleReload = () => {
    timelineRef.current!.refresh(new Date(), getTimelineInitialRange())

    if (showUpcomingEvents) {
      upcomingRef.current!.refresh(new Date(), getUpcomingInitialRange())
    }
  }

  useImperativeHandle(props.timelineRef, () => ({
    refresh: handleReload
  }))

  if (!props.contact) {
    return null
  }

  const filter = {
    contactId: props.contact.id,
    object_types: ['crm_association', 'email_campaign_recipient']
  }

  const notes = getNotes(props.contact).map(note =>
    convertNoteToCalendarEvent(note, props.contact)
  )

  return (
    <Container>
      <Button
        variant="outlined"
        color="secondary"
        onClick={() => setShowUpcomingEvents(!showUpcomingEvents)}
      >
        {showUpcomingEvents ? 'Hide' : 'Show'} Upcoming Events
      </Button>

      {showUpcomingEvents && (
        <>
          <Title>Upcoming Events</Title>

          <Card>
            <List
              ref={upcomingRef}
              filter={filter}
              associations={associations}
              initialRange={getUpcomingInitialRange()}
              directions={[LoadingDirection.Bottom]}
              placeholders={[Placeholder.Month]}
              defaultEvents={notes} // TODO: convert notes to events
            />
          </Card>
        </>
      )}

      <Title>Current Events</Title>

      <Card
        style={{
          marginTop: '1rem'
        }}
      >
        <List
          contrariwise // display calendar events vice versa
          ref={timelineRef}
          filter={filter}
          initialRange={getTimelineInitialRange()}
          associations={associations}
          directions={[LoadingDirection.Bottom]}
          placeholders={[Placeholder.Month]}
          defaultEvents={notes} // TODO: convert notes to events
        />
      </Card>
    </Container>
  )
}

export default forwardRef((props: Props, ref: RefObject<TimelineRef>) => (
  <Timeline {...props} timelineRef={ref} />
))
