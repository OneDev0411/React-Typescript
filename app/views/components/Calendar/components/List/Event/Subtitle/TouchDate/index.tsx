import React from 'react'
import timeago from 'timeago.js'

interface Props {
  event: ICalendarEvent
}

export function TouchDate({ event }: Props) {
  if (!event.full_contact) {
    return null
  }

  const contact = event.full_contact as IContact & { next_touch: number }

  const { next_touch: nextTouch, last_touch: lastTouch } = contact

  if (!lastTouch) {
    return null
  }

  const lastTouchTime = timeago().format(lastTouch * 1000)

  return (
    <span>
      Your last touch was ${lastTouchTime} days ago, you wanted to be in touch
      every ${Math.round((nextTouch - lastTouch) / 86400)} days.
    </span>
  )
}
