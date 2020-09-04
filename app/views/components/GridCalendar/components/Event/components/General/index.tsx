import React, { memo } from 'react'
import cn from 'classnames'

import { useCommonStyles } from '../../use-style'
import { BaseEventProps } from '../..'

const GeneralEventComponent = ({
  event,
  rowEvent,
  handleShowDetails
}: BaseEventProps) => {
  const classes = useCommonStyles()
  const { event_type, all_day, timestamp, end_date } = rowEvent

  const startDate = new Date(Number(timestamp || 0) * 1000)
  const endDate = new Date(Number(end_date || 0) * 1000)
  const isDiffrentDay =
    startDate.getDate() < endDate.getDate() ||
    startDate.getMonth() < endDate.getMonth()

  return (
    <div
      className={cn(classes.container, classes.general, {
        [classes.multiDay]:
          all_day ||
          isDiffrentDay ||
          ['Open House', 'Tour'].includes(event_type)
      })}
      onClick={handleShowDetails}
    >
      {!all_day && <span data-for="date">{event.timeText}m</span>}
      <span>{event.event.title}</span>
    </div>
  )
}

export const GeneralEvent = memo(GeneralEventComponent)
