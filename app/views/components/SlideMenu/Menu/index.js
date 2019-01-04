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

export const Menu = Container

Menu.propTypes = propTypes
Menu.defaultProps = defaultProps
