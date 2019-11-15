import React, {
  useState,
  useRef,
  useImperativeHandle,
  ChangeEvent,
  forwardRef,
  RefObject
} from 'react'

import { getNotes } from 'models/contacts/helpers/get-notes'

import List from 'components/Calendar'
import { CalendarRef, LoadingDirection } from 'components/Calendar/types'
import { hasUserAccess } from 'utils/user-teams'

import { getUpcomingInitialRange } from './helpers/get-upcoming-range'
import { getTimelineInitialRange } from './helpers/get-timeline-range'
import { convertNoteToCalendarEvent } from './helpers/convert-note-to-calendar-event'

import AddEvent from './AddEvent'
import AddNote from './AddNote'

import { TabsFilter, Filters } from './Tabs'

import { Container, Header, Actions } from './styled'

export interface TimelineRef {
  refresh(): void
}

interface Props {
  contact: IContact
  user: IUser
  timelineRef?: RefObject<TimelineRef>
  onCreateNote(contact: IContact): void
}

const associations = ['calendar_event.full_thread']

function Timeline(props: Props) {
  const timelineRef = useRef<CalendarRef>(null)

  const [activeFilter, setActiveFilter] = useState<Filters>(Filters.All)

  const filter = {
    contact: props.contact.id,
    object_types: [
      ...(hasUserAccess(props.user, 'BetaFeatures')
        ? ['email_thread_recipient']
        : []),
      'crm_association',
      'email_campaign_recipient',
      'contact',
      'contact_attribute',
      'deal_context'
    ]
  }

  const getCalendarRange = (filter: Filters) =>
    filter === Filters.All
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
        <TabsFilter
          activeFilter={activeFilter}
          onChangeFilter={handleChangeFilter}
        />

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
          contrariwise={activeFilter === Filters.All}
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
