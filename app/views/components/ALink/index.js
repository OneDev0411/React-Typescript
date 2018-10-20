import PropTypes from 'prop-types'
import { Link } from 'react-router'
import styled from 'styled-components'

import { primary, grey } from '../../utils/colors'

const propTypes = {
  /**
   * When true, the link is disabled.
   */
  disabled: PropTypes.bool,

  /**
   * When true, the link is activated.
   */
  isActive: PropTypes.bool,

  /**
   * When true, the link width is 100%.
   */
  isBlock: PropTypes.bool
}

const defaultProps = {
  disabled: false,
  isActive: false,
  isBlock: false
}

const ALink = styled.a`
  color: #000;

  &:not([disabled]):hover,
  &:not([disabled]):focus {
    color: ${primary};
  }

  &[disabled] {
    color: ${grey.A300};
  }
`

export default Object.assign(ALink.withComponent(Link), {
  propTypes,
  defaultProps
})
