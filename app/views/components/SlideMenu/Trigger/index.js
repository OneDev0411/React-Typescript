import React from 'react'
import PropTypes from 'prop-types'
import IconNav from '../../SvgIcons/NavMenu/IconNav'
import Tooltip from '../../tooltip'

import { Container } from './styled'

const propTypes = {
  onClick: PropTypes.func.isRequired,
  tooltip: PropTypes.string
}

const defaultProps = {
  tooltip: null
}

export const Trigger = ({ onClick, tooltip }) => (
  <Container>
    <Tooltip caption={tooltip} placement="bottom">
      <IconNav onClick={onClick} style={{ marginRight: '16px' }} />
    </Tooltip>
  </Container>
)

Trigger.propTypes = propTypes
Trigger.defaultProps = defaultProps
