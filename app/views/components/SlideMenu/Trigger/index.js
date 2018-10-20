import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../tooltip'
import Button from '../../Button/IconButton'
import IconNav from '../../SvgIcons/NavMenu/IconNav'

const propTypes = {
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string,
  style: PropTypes.shape()
}

const defaultProps = {
  tooltip: null,
  style: {}
}

export const Trigger = props => {
  let { tooltip } = props

  if (!tooltip) {
    tooltip = props.isExpended || props.isOpen ? 'Collapse Menu' : 'Expand Menu'
  }

  return (
    <Tooltip caption={tooltip} placement="bottom">
      <Button
        isFit
        onClick={props.onClick}
        style={{ marginRight: '1em', ...props.style }}
      >
        <IconNav />
      </Button>
    </Tooltip>
  )
}

Trigger.propTypes = propTypes
Trigger.defaultProps = defaultProps
