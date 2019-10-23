import React from 'react'
import timeago from 'timeago.js'

interface Props {
  event: ICalendarEvent
  contact: IContact
}

export function TouchDateSubtitle({ event, contact }: Props) {
  const now = Date.now()

  const {
    next_touch: nextTouch,
    last_touch: lastTouch,
    touch_freq
  } = contact as IContact & { next_touch: number }

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
      {touch_freq} days.
    </span>
  )
}
