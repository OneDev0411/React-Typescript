import PropTypes from 'prop-types'

import { Container } from './styled'

const propTypes = {
  children: PropTypes.node,
  isOpen: PropTypes.bool.isRequired,
  width: PropTypes.any
}

const defaultProps = {
  width: '11em'
}

export const Menu = Container

Menu.propTypes = propTypes
Menu.defaultProps = defaultProps
