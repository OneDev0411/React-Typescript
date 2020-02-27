import React, {
  forwardRef,
  RefObject,
  useImperativeHandle,
  useRef,
  useState
} from 'react'
import { createStyles, makeStyles, Theme } from '@material-ui/core'

import List from 'components/Calendar'
import { CalendarRef } from 'components/Calendar/types'

import { getTimelineInitialRange } from './helpers/get-timeline-range'

import { Notes } from './Notes'

// import AddEvent from './AddEvent'
// import AddNote from './AddNote'

import { Filters, TabsFilter } from './Tabs'

export interface TimelineRef {
  refresh(): void
}

interface Props {
  contact: IContact
  timelineRef?: RefObject<TimelineRef>
  onChangeNote(contact: IContact): void
}

const associations = ['calendar_event.full_thread']

export const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    container: {
      display: 'flex',
      flexFlow: 'column',
      height: '100vh',
      maxHeight: '100vh',
      overflow: 'hidden',
      padding: theme.spacing(0, 2)
    },
    filters: {
      flex: '0 1 auto'
    },
    list: {
      flex: '1 1 auto'
    }
  })
)

function Timeline(props: Props) {
  const classes = useStyles()
  const timelineRef = useRef<CalendarRef>(null)

  const [activeFilter, setActiveFilter] = useState<Filters>(Filters.Events)

  const handleReload = (filter = activeFilter) => {
    timelineRef.current!.refresh(new Date(), getTimelineInitialRange())
  }

  const handleChangeFilter = (value: number) => {
    setActiveFilter(value)
  }

  const getFilter = () => {
    if (activeFilter === Filters.Notes) {
      return {
        object_types: ['contact_notes']
      }
    }

    return {
      contact: props.contact.id,
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

  useImperativeHandle(props.timelineRef, () => ({
    refresh: handleReload
  }))

  if (!props.contact) {
    return null
  }

  return (
    <div className={classes.container}>
      <div className={classes.filters}>
        <TabsFilter onChangeFilter={handleChangeFilter} />
      </div>

      <div className={classes.list}>
        {activeFilter === Filters.Events && (
          <List
            contrariwise
            ref={timelineRef}
            contact={props.contact}
            filter={getFilter()}
            initialRange={getTimelineInitialRange()}
            associations={associations}
            placeholders={[]}
          />
        )}

        {activeFilter === Filters.Notes && (
          <Notes contact={props.contact} onChange={props.onChangeNote} />
        )}
      </div>
    </div>
  )
}

export default forwardRef((props: Props, ref: RefObject<TimelineRef>) => (
  <Timeline {...props} timelineRef={ref} />
))
