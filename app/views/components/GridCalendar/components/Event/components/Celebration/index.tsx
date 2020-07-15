import React, { memo } from 'react'
import cn from 'classnames'

import { useCommonStyles } from '../../use-style'
import { BaseEventProps } from '../..'

const CelebrationEventComponent = ({
  event,
  rowEvent,
  handleShowDetails
}: BaseEventProps) => {
  const classes = useCommonStyles()

  return (
    <div
      className={cn(classes.container, classes.celebration)}
      onClick={handleShowDetails}
    >
      <span>{event.event.title}</span>
    </div>
  )
}

export const CelebrationEvent = memo(CelebrationEventComponent)
