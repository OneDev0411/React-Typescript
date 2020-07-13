import React from 'react'
import cn from 'classnames'

import { useCommonStyles } from '../../use-style'
import { BaseEventProps } from '../..'

export const DealEvent = ({
  event,
  rowEvent,
  handleShowDetails
}: BaseEventProps) => {
  const classes = useCommonStyles()

  return (
    <div
      className={cn(classes.container, classes.deal)}
      onClick={handleShowDetails}
    >
      <span>{event.event.title}</span>
    </div>
  )
}
