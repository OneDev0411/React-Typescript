import React, {
  useState,
  useRef,
  useImperativeHandle,
  ChangeEvent,
  forwardRef,
  RefObject
} from 'react'

import { Tabs, Tab, createStyles, makeStyles, Theme } from '@material-ui/core'

import { getNotes } from 'models/contacts/helpers/get-notes'

import List from 'components/Calendar'
import { CalendarRef, LoadingDirection } from 'components/Calendar/types'

import { CRM_TASKS_QUERY } from 'models/contacts/helpers/default-query'

import { getUpcomingInitialRange } from './helpers/get-upcoming-range'
import { getTimelineInitialRange } from './helpers/get-timeline-range'
import { convertNoteToCalendarEvent } from './helpers/convert-note-to-calendar-event'

import AddEvent from './AddEvent'
import AddNote from './AddNote'

import { Container, Header, Actions } from './styled'

enum Filter {
  All = 0,
  Upcoming = 1
}

export interface TimelineRef {
  refresh(): void
}

interface Props {
  contact: IContact
  timelineRef?: RefObject<TimelineRef>
  onCreateNote(contact: IContact): void
}

const associations = [
  ...CRM_TASKS_QUERY.associations,
  'calendar_event.crm_task',
  'calendar_event.full_campaign',
  'calendar_event.full_crm_task'
]

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      fontSize: theme.typography.subtitle1.fontSize
    }
  })
)

function Timeline(props: Props) {
  const timelineRef = useRef<CalendarRef>(null)
  const classes = useStyles()

  const [activeFilter, setActiveFilter] = useState<Filter>(Filter.All)

  const filter = {
    contact: props.contact.id,
    object_types: [
      'email_thread_recipient',
      'email_thread',
      'crm_association',
      'email_campaign_recipient',
      'contact_attribute'
    ]
  }

  const getCalendarRange = (filter: Filter) =>
    filter === Filter.All
      ? getTimelineInitialRange()
      : getUpcomingInitialRange()

  const handleReload = (filter = activeFilter) => {
    timelineRef.current!.refresh(new Date(), getCalendarRange(filter))
  }

  const handleChangeFilter = (e: ChangeEvent<{}> | null, value: number) => {
    // update filter
    setActiveFilter(value)
  }

  const handleCreateNote = (contact: IContact) => {
    props.onCreateNote(contact)

    // reload timeline
    handleReload()
  }

  useImperativeHandle(props.timelineRef, () => ({
    refresh: handleReload
  }))

  if (!props.contact) {
    return null
  }

  const notes = getNotes(props.contact).map(note =>
    convertNoteToCalendarEvent(note, props.contact)
  )

  return (
    <Container>
      <Header>
        <div>
          <Tabs
            value={activeFilter}
            onChange={handleChangeFilter}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab
              value={Filter.All}
              label="All Events"
              classes={{
                root: classes.root
              }}
            />
            <Tab
              value={Filter.Upcoming}
              label="Upcoming Events"
              classes={{
                root: classes.root
              }}
            />
          </Tabs>
        </div>

        <Actions>
          <AddNote
            contactId={props.contact.id}
            onCreateNote={handleCreateNote}
          />
          <AddEvent contact={props.contact} />
        </Actions>
      </Header>

      <div>
        <List
          // display calendar events vice versa
          contrariwise={activeFilter === Filter.All}
          ref={timelineRef}
          filter={filter}
          initialRange={getCalendarRange(activeFilter)}
          associations={associations}
          directions={[LoadingDirection.Bottom]}
          placeholders={[]}
          defaultEvents={notes} // TODO: convert notes to events
        />
      </div>
    </Container>
  )
}

export default forwardRef((props: Props, ref: RefObject<TimelineRef>) => (
  <Timeline {...props} timelineRef={ref} />
))
