import React from 'react'

import Tooltip from 'components/tooltip'
import Button from 'components/Button/IconButton'

export function FooterAction(props) {
  return (
    <Tooltip caption={props.tooltipCaption}>
      <Button
        iconSize="XLarge"
        style={{ marginRight: '0.5rem' }}
        isFit
        onClick={props.onClick}
      >
        {props.children}
      </Button>
    </Tooltip>
  )
}
