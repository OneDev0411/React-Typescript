import React from 'react'
import PropTypes from 'prop-types'
import IconNav from '../../SvgIcons/NavMenu/IconNav'
import { Container } from './styled'

const propTypes = {
  onClick: PropTypes.func
}

const defaultProps = {}

export const Trigger = ({ onClick }) => (
  <Container>
    <IconNav onClick={onClick} />
  </Container>
)

Trigger.propTypes = propTypes
Trigger.defaultProps = defaultProps
