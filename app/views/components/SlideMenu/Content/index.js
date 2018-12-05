import React from 'react'
import PropTypes from 'prop-types'

import { Container } from './styled'

const propTypes = {
  isSideMenuOpen: PropTypes.bool.isRequired,
  menuWidth: PropTypes.string
}

const defaultProps = {
  menuWidth: '11rem'
}

export const Content = props => (
  <Container {...props}>{props.children}</Container>
)

Content.propTypes = propTypes
Content.defaultProps = defaultProps
