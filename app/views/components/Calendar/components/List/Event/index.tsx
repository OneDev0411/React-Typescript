import React from 'react'
import fecha from 'fecha'

import { EventItem } from './Item'
import useStyles from './styles'

interface Props {
  style: React.CSSProperties
  item: ICalendarEvent
  nextItem: ICalendarListRow
  onClickCrmEventAssociations: (event: ICalendarEvent) => void
}

/**
 * renders the given calendar event
 */
export function Event({
  item,
  nextItem,
  style,
  onClickCrmEventAssociations
}: Props) {
  const date =
    item.object_type === 'crm_task'
      ? fecha.format(new Date(item.timestamp * 1000), 'hh:mm A')
      : 'All day'

  const classes = useStyles({
    hasBorderBottom: nextItem && !nextItem.hasOwnProperty('is_day_header')
  })

  return (
    <div style={style} className={classes.container}>
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div className={classes.time}>{date}</div>

        <EventItem
          event={item}
          onClickCrmEventAssociations={onClickCrmEventAssociations}
        />
      </div>

      <div>&nbsp;</div>
    </div>
  )
}
