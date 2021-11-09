import { forwardRef, RefObject, useImperativeHandle, useRef } from 'react'

import List from 'components/ContactProfileTimeline'
import { CalendarRef } from 'components/ContactProfileTimeline/types'

import { Filters } from '../Tabs'

import { getTimelineInitialRange } from './helpers/get-timeline-range'
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

  const handleReload = (filter = activeFilter) => {
    if (filter === Filters.Events) {
      localTimelineRef.current!.refresh(new Date(), getTimelineInitialRange())
    }
  }

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
      {activeFilter === Filters.Events && (
        <List
          contrariwise
          ref={localTimelineRef}
          contact={contact}
          filter={getFilter()}
          initialRange={getTimelineInitialRange()}
          associations={associations}
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
