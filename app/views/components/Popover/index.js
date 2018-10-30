import React from 'react'
import { OverlayTrigger, Popover } from 'react-bootstrap'

const PopOver = ({
  id = 'rechat-tooltip',
  caption,
  placement = 'top',
  overlayOptions = {
    trigger: ['hover']
  },
  popoverStyles = {},
  children
}) => {
  if (!caption) {
    return children
  }

  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Popover
          className="white--popover"
          id={id}
          style={{ ...popoverStyles }}
        >
          {caption}
        </Popover>
      }
      {...overlayOptions}
    >
      {children}
    </OverlayTrigger>
  )
}

export default PopOver
