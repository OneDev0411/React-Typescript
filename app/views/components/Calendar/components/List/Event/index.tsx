import React from 'react'
import fecha from 'fecha'
import { makeStyles } from '@material-ui/styles'

import CrmEvent from './CrmEvent'
import { DealContext } from './DealContext'
import { ContactAttribute } from './ContactAttribute'

interface Props {
  style: React.CSSProperties
  event: ICalendarEvent
  nextItem: ICalendarListRow
  onClickCrmEventAssociations: (event: ICalendarEvent) => void
}

const useStyles = makeStyles({
  root: {
    display: 'flex',
    alignItems: 'center',
    padding: '0 1rem',
    transition: '0.1s ease-in background-color',
    '&:hover': {
      borderRadius: '2px',
      backgroundColor: '#f7f9fe'
    }
  },
  container: {
    justifyContent: 'space-between'
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

  const classes = useStyles()

  const hasBorderBottom = nextItem && !nextItem.hasOwnProperty('is_day_header')

  const rowStyle = {
    ...style,
    borderBottom: hasBorderBottom ? '1px solid #dbe6fd' : 'none'
  }

  if (event.object_type === 'crm_task') {
    return (
      <CrmEvent
        rowStyle={rowStyle}
        classes={classes}
        date={date}
        event={event}
        onClickCrmEventAssociations={onClickCrmEventAssociations}
      />
    )
  }

  if (event.object_type === 'contact_attribute') {
    return (
      <ContactAttribute
        rowStyle={rowStyle}
        classes={classes}
        date={date}
        event={event}
      />
    )
  }

  if (event.object_type === 'deal_context') {
    return (
      <DealContext
        rowStyle={rowStyle}
        classes={classes}
        date={date}
        event={event}
      />
    )
  }

  return null
}
