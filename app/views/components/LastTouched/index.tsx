import React from 'react'
import timeago from 'timeago.js'

interface Props {
  contact: IContact
}

export function LastTouched(props: Props) {
  const { last_touch: lastTouch, next_touch: nextTouch } = props.contact

  if (!lastTouch) {
    return <div>You have not added any touches for this contact.</div>
  }

  return (
    <div>
      <span>
        Last Touch was <b>{timeago().format(lastTouch * 1000)}</b>
      </span>
      {nextTouch ? (
        <span>
          , you wanted to be in touch every{' '}
          <b>{Math.round((nextTouch - lastTouch) / 86400)}</b> days.
        </span>
      ) : (
        '.'
      )}
    </div>
  )
}
