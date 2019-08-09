import React from 'react'
import fecha from 'fecha'
import { makeStyles } from '@material-ui/styles'

import { EventIcon } from './EventIcon'
import { EventTitle } from './Title'
import { EventActions } from './Actions'

import styles from './styles'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
  onClickCrmEventAssociations: (event: ICalendarEvent) => void
}

interface StyleProps {
  hasBorderBottom: boolean | null
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
    borderBottom: (props: StyleProps) =>
      props.hasBorderBottom ? '1px solid rgba(219, 230, 253, 0.5)' : 'none',
    '&:hover': {
      borderRadius: '2px',
      backgroundColor: '#f7f9fe'
    }
  }
})

/**
 * renders the given calendar event
 */
export function Event({
  event,
  nextItem,
  style,
  onClickCrmEventAssociations
}: Props) {
  const date =
    event.object_type === 'crm_task'
      ? fecha.format(new Date(event.timestamp * 1000), 'hh:mm A')
      : 'All day'

  const hasBorderBottom = nextItem && !nextItem.hasOwnProperty('is_day_header')

  const classes = useStyles({
    hasBorderBottom
  })

  return (
    <div style={style}>
      <div className={classes.root}>
        <div style={styles.row}>
          <div style={styles.container}>
            <div style={styles.time}>{date}</div>
            <div
              style={{
                ...styles.container,
                ...styles.title
              }}
            >
              <EventIcon event={event} />
              <EventTitle
                event={event}
                onClickCrmEventAssociations={onClickCrmEventAssociations}
              />
            </div>
          </div>

          <div>
            <EventActions event={event} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.subtitle}>{getSubtitle(event)}</div>
        </div>
      </div>
    </div>
  )
}

function getSubtitle(event: ICalendarEvent) {
  if (event.object_type === 'crm_task' && event.event_type === 'Email') {
    return event.title
  }

  return ''
}
