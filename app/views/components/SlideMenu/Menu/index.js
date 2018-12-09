import React from 'react'
import PropTypes from 'prop-types'

import { Container } from './styled'

const propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  width: PropTypes.string
}

const defaultProps = {
  width: '11rem'
}

export const Menu = props => (
  <Container isOpen={props.isOpen} width={props.width}>
    {props.children}
  </Container>
)

Menu.propTypes = propTypes
Menu.defaultProps = defaultProps
