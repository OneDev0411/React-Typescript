import PropTypes from 'prop-types'
import { Link } from 'react-router'
import styled, { css } from 'styled-components'

import { grey, primary } from '../../utils/colors'

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
   * When true, default appearance of links is not applied.
   * Useful for wrapping link around arbitrary elements.
   */
  noStyle: PropTypes.bool,

  /**
   * When true, the link width is 100%.
   */
  isBlock: PropTypes.bool
}

const defaultProps = {
  disabled: false,
  isActive: false,
  noStyle: false,
  isBlock: false
}

const ALink = styled.a`
  color: #000;

  ${({ noStyle }) =>
    noStyle
      ? css`
          &:hover,
          &:focus {
            text-decoration: none;
          }
        `
      : css`
          &:not([disabled]):hover,
          &:not([disabled]):focus {
            color: ${primary};
          }
        `}

  &[disabled] {
    color: ${grey.A300};
  }
`

export default Object.assign(ALink.withComponent(Link), {
  propTypes,
  defaultProps
})
