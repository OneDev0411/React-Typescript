import React from 'react'
import timeago from 'timeago.js'

interface Props {
  event: ICalendarEvent
}

export function TouchDate({ event }: Props) {
  if (!event.full_contact) {
    return null
  }

  const now = Date.now()

  const {
    next_touch: nextTouch,
    last_touch: lastTouch
  } = event.full_contact as IContact & { next_touch: number }

  if (!lastTouch) {
    return null
  }

  const lastTouchTime = timeago().format(lastTouch * 1000)

  if (now < nextTouch * 1000) {
    return <span>You were in touch {lastTouchTime}.</span>
  }

  return (
    <span>
      Your last touch was {lastTouchTime}, you wanted to be in touch every{' '}
      {Math.round((nextTouch - lastTouch) / 86400)} days.
    </span>
  )
}
