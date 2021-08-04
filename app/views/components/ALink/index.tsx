import React from 'react'

import { Link, LinkProps } from 'react-router'
import styled, { css } from 'styled-components'

import { grey, primary } from '../../utils/colors'

interface Props {
  /**
   * When true, the link is disabled.
   */
  disabled?: boolean

  /**
   * When true, default appearance of links is not applied.
   * Useful for wrapping link around arbitrary elements.
   */
  noStyle?: boolean
}

const defaultProps = {
  disabled: false,
  noStyle: false
}

const ALink = styled.a<Props>`
  color: #000;
  cursor: pointer;

  ${({ noStyle }) =>
    noStyle
      ? css`
          &:hover,
          &:focus {
            color: inherit;
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
const LinkWrapper = ({ noStyle, disabled, ...rest }: Props & LinkProps) => {
  return <Link {...rest} />
}

export default Object.assign(ALink.withComponent(LinkWrapper), {
  defaultProps
})
