import React from 'react'
import fecha from 'fecha'

import { EventItem } from './Item'
import { ContainerStyle, TimeStyle } from './styled'

interface Props {
  style: React.CSSProperties
  item: ICalendarEvent
  nextItem: ICalendarListRow
  onClickCrmEventAssociations: (event: ICalendarEvent) => void
}

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

  return (
    <div
      style={{
        ...style,
        ...ContainerStyle,
        borderBottom:
          nextItem && !nextItem.hasOwnProperty('is_day_header')
            ? '1px solid #dbe6fd'
            : 'none'
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center'
        }}
      >
        <div style={TimeStyle}>{date}</div>

        <EventItem
          event={item}
          onClickCrmEventAssociations={onClickCrmEventAssociations}
        />
      </div>

      <div>----</div>
    </div>
  )
}
