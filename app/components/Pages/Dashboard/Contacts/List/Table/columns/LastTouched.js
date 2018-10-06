import React from 'react'
import timeago from 'timeago.js'
import { Popover, OverlayTrigger } from 'react-bootstrap'
import styled from 'styled-components'
import { grey } from '../../../../../../../views/utils/colors'

const NoTouches = styled.div`
  color: ${grey.A550};
`
export function LastTouchedCell(props) {
  const { contact } = props

  if (!contact.last_touch) {
    return <NoTouches className="blackHover">No Touches</NoTouches>
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
