import React from 'react'
import cn from 'classnames'

import { useCommonStyles } from '../../use-style'
import { BaseEventProps } from '../..'

export const GeneralEvent = ({
  event,
  rowEvent,
  handleShowDetails
}: BaseEventProps) => {
  const classes = useCommonStyles()

  return (
    <div
      className={cn(classes.container, classes.general)}
      onClick={handleShowDetails}
    >
      {!rowEvent.all_day && <span data-for="date">{event.timeText}m</span>}
      <span>{event.event.title}</span>
    </div>
  )
}
