import React from 'react'
import timeago from 'timeago.js'
import { Popover, OverlayTrigger } from 'react-bootstrap'

export function LastTouchedCell(props) {
  const { contact } = props

  if (!contact.last_touch) {
    return <div style={{ color: '#c5c5c5' }}>No Touches</div>
  }

  const formatedLastTouch = timeago().format(contact.last_touch * 1000)

  if (!contact.next_touch) {
    return formatedLastTouch
  }

  return (
    <OverlayTrigger
      overlay={
        <Popover id={`last-touch-popover_${contact.id}`}>
          <span>Last touch was </span>
          <b>{formatedLastTouch}, </b>
          <span>you wanted to be in touch every 7 days.</span>
        </Popover>
      }
    >
      <span>{formatedLastTouch}</span>
    </OverlayTrigger>
  )
}
