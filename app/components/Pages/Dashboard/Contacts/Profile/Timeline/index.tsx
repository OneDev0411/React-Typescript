import {
  forwardRef,
  RefObject,
  useCallback,
  useEffect,
  useImperativeHandle,
  useRef
} from 'react'

import List from 'components/ContactProfileTimeline'
import { CalendarRef } from 'components/ContactProfileTimeline/types'

import { Filters } from '../Tabs'

import { Notes } from './Notes'

export interface TimelineRef {
  refresh(): void
}

interface Props {
  contact: INormalizedContact
  activeFilter: Filters
  timelineRef?: RefObject<TimelineRef>
  onChangeNote: (contact: IContact, fallback?: () => void) => void
}

const associations = ['calendar_event.full_thread']

function Timeline({ contact, activeFilter, timelineRef, onChangeNote }: Props) {
  const localTimelineRef = useRef<CalendarRef>(null)
  const contactId = contact.id

  const handleReload = useCallback(
    (filter = activeFilter) => {
      if (filter === Filters.History || filter === Filters.Upcoming) {
        const date = new Date().getTime() / 1000

        localTimelineRef.current!.refresh(true, { high: date, low: date })
      }
    },
    [activeFilter]
  )

  // We have to reload time line when contact changed
  // https://gitlab.com/rechat/web/-/issues/7096#note_1230178460
  useEffect(() => {
    handleReload()
  }, [contactId, handleReload])

  const getFilter = () => {
    if (activeFilter === Filters.Notes) {
      return {
        object_types: ['contact_notes']
      }
    }

    return {
      contact: contact.id,
      object_types: [
        'email_thread_recipient',
        'crm_association',
        'email_campaign_recipient',
        'contact',
        'contact_attribute',
        'deal_context'
      ]
    }
  }

  useImperativeHandle(timelineRef, () => ({
    refresh: handleReload
  }))

  if (!contact) {
    return null
  }

  return (
    <>
      {activeFilter === Filters.History && (
        <List
          ref={localTimelineRef}
          contact={contact}
          filter={getFilter()}
          associations={associations}
          eventType={activeFilter}
        />
      )}
      {activeFilter === Filters.Upcoming && (
        <List
          ref={localTimelineRef}
          contact={contact}
          filter={getFilter()}
          associations={associations}
          eventType={activeFilter}
        />
      )}

      {activeFilter === Filters.Notes && (
        <Notes contact={contact} onChange={onChangeNote} />
      )}
    </>
  )
}

export default forwardRef((props: Props, ref: RefObject<TimelineRef>) => (
  <Timeline {...props} timelineRef={ref} />
))
