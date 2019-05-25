import React from 'react'
import cn from 'classnames'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'

function br2nl(text) {
  return text.split('<br />').map((item, key) => (
    <div key={key} style={{ textAlign: 'left' }}>
      {item}
    </div>
  ))
}

export default ({
  id = 'rechat-tooltip',
  caption,
  captionIsHTML = false,
  placement = 'top',
  multiline = false,
  overlayOptions = {
    trigger: ['hover']
  },
  tooltipStyles = {},
  children,
  leftAlign = false,
  size = '', // just accepet small for now
  type = '', // just accepet error for now
  isCustom = true // this is a temporary prop. don't use it.
}) => {
  if (!caption) {
    return children
  }

  return (
    <OverlayTrigger
      placement={placement}
      overlay={
        <Tooltip
          id={id}
          className={cn(`rechat-tooltip ${size} ${type}`, {
            'is-customized': captionIsHTML && isCustom,
            'text-align--left': leftAlign
          })}
          style={{ ...tooltipStyles }}
        >
          {multiline && !captionIsHTML ? br2nl(caption) : caption}
        </Tooltip>
      }
      {...overlayOptions}
    >
      {children}
    </OverlayTrigger>
  )
}
