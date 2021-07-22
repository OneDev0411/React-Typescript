import React, { memo } from 'react'

import cn from 'classnames'

import { BaseEventProps } from '../..'
import { useCommonStyles } from '../../use-style'

const DealEventComponent = ({
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

export const DealEvent = memo(DealEventComponent)
