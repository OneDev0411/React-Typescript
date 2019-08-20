import React from 'react'
import timeago from 'timeago.js'

interface Props {
  event: ICalendarEvent
}

export function TouchDate({ event }: Props) {
  if (!event.full_contact) {
    return null
  }

  const { last_touch: lastTouch, next_touch: nextTouch } = event.full_contact

  if (nextTouch && lastTouch) {
    return (
      <span>
        You wanted to be in touch every{' '}
        {Math.round((nextTouch - lastTouch) / 86400)} days.
      </span>
    )
  }

  if (lastTouch) {
    return <span>Last touch was {timeago().format(lastTouch * 1000)}.</span>
  }

  return <span>You have not added any touches for this contact.</span>
}
