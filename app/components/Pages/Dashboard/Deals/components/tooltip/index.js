import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

function br2nl(text) {
  return text.split('<br />').map((item, key) => (
    <div key={key} style={{ textAlign: 'left' }}>
      {item}
    </div>
  ))
}

export default ({
  caption, placement = 'top', multiline = false, children
}) => {
  if (!caption) {
    return children
  }

  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip id="deal-tooltip">{multiline ? br2nl(caption) : caption}</Tooltip>
      }
    >
      {children}
    </OverlayTrigger>
  )
}
