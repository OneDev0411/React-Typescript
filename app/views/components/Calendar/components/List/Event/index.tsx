import React from 'react'
import fecha from 'fecha'
import { makeStyles } from '@material-ui/styles'
import { Theme } from '@material-ui/core/styles'

import { EventIcon } from './EventIcon'
import { EventTitle } from './Title'
import { EventSubTitle } from './Subtitle'
import { EventActions } from './Actions'

import { TodayEmptyState } from './TodayEmptyState'

import emptyStateEvent from '../../../helpers/get-event-empty-state'

import styles from './styles'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  user: IUser
  nextItem: ICalendarListRow
  onSelectEvent: (event: ICalendarEvent) => void
}

interface StyleProps {
  hasBorderBottom: boolean | null
}

const useStyles = makeStyles((theme: Theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-start',
    justifyContent: 'center',
    height: '100%',
    borderBottom: (props: StyleProps) =>
      props.hasBorderBottom ? '1px solid rgba(219, 230, 253, 0.5)' : 'none',
    '& button.calendar-action, a.MuiButtonBase-root': {
      borderColor: '#eee',
      color: '#eee'
    },
    '&:hover': {
      transition: '0.2s ease-in background-color',
      backgroundColor: theme.palette.action.hover,
      '& button.calendar-action, a.MuiButtonBase-root': {
        borderColor: 'inherit',
        color: 'inherit'
      }
    }
  }
}))

/**
 * renders the given calendar event
 */
export function Event({ event, user, nextItem, style, onSelectEvent }: Props) {
  const date =
    event.object_type === 'crm_task'
      ? fecha.format(new Date(event.timestamp * 1000), 'hh:mm A')
      : 'All day'

  const hasBorderBottom = nextItem && !nextItem.hasOwnProperty('is_day_header')

  const classes = useStyles({
    hasBorderBottom
  })

  if (event.event_type === emptyStateEvent.event_type) {
    return <TodayEmptyState style={style} />
  }

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
                onClickCrmEventAssociations={onSelectEvent}
                onClickScheduledEmail={onSelectEvent}
              />
            </div>
          </div>

          <div>
            <EventActions event={event} user={user} />
          </div>
        </div>

        <div style={styles.row}>
          <div style={styles.subtitle}>
            <EventSubTitle event={event} />
          </div>
        </div>
      </div>
    </div>
  )
}
