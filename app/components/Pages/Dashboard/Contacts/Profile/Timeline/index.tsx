import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef
} from 'react'
import { makeStyles, Theme } from '@material-ui/core'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import { getTimelineInitialRange } from './helpers/get-timeline-range'

import { Notes } from './Notes'

import { Filters } from '../Tabs'

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

export const useStyles = makeStyles(
  (theme: Theme) => ({
    container: {
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden'
    }
  }),
  {
    name: 'ContactProfileTimeline'
  }
)

function Timeline({ contact, activeFilter, timelineRef, onChangeNote }: Props) {
  const classes = useStyles()
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
    <div className={classes.container}>
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
    </div>
  )
}

export default forwardRef((props: Props, ref: RefObject<TimelineRef>) => (
  <Timeline {...props} timelineRef={ref} />
))
