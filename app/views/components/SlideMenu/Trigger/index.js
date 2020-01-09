import React from 'react'
import PropTypes from 'prop-types'

import Tooltip from '../../tooltip'
import Button from '../../Button/IconButton'
import IconNav from '../../SvgIcons/NavMenu/IconNav'

const propTypes = {
  onClick: PropTypes.func.isRequired,
  isExpended: PropTypes.bool,
  isOpen: PropTypes.bool,
  tooltip: PropTypes.string,
  style: PropTypes.shape(),
  className: PropTypes.string
}

const defaultProps = {
  tooltip: null,
  style: {},
  className: 'c-menu-trigger'
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
        className={props.className}
        style={{ marginRight: '1em', ...props.style }}
      >
        <IconNav />
      </Button>
    </Tooltip>
  )
}

Trigger.propTypes = propTypes
Trigger.defaultProps = defaultProps
