import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '16'
const height = '16'
const viewBox = '0 0 16 16'

const sizes = {
  small: { width: 16, height: 16 },
  medium: { width: 24, height: 24 },
  large: { width: 32, height: 32 }
}

// somehow sizes is ending up in markup, even if it is not a valid svg attribute
// until we have a better solution, just render it empty, instead to '[Object object]'
Object.defineProperty(sizes, 'toString', { value: () => '', enumerable: false })

const getDimensions = (size, sizes) => {
  if (size && typeof size.width === 'number' && typeof size.height === 'number') {
    return size
  }
  return size && sizes[size]
    ? sizes[size]
    : { width, height }
}

const getCss = (size, sizes, fillColor, fillColorRule, noStyles) => {
  if (noStyles) { return '' }
  const dimensions = getDimensions(size, sizes)
  const fillRule = fillColor && fillColorRule ? `${fillColorRule}{ fill: ${fillColor}; }` : ''
  return css`
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    ${fillRule}
  `
}

const propsToCss = ({
  size,
  sizes,
  fillColor,
  fillColorRule,
  noStyles
}) => getCss(size, sizes, fillColor, fillColorRule, noStyles)

const Image = styled.svg`${propsToCss}`

const children = (
  <Fragment>
    <path
      d='M10.88 12.16a1.28 1.28 0 0 0 1.28-1.28v-9.6A1.28 1.28 0 0 0 10.88 0h-9.6A1.28 1.28 0 0 0 0 1.28v9.6c0 .707.573 1.28 1.28 1.28h9.6zM1.28 1.6a.32.32 0 0 1 .32-.32h8.96a.32.32 0 0 1 .32.32v8.96a.32.32 0 0 1-.32.32H1.6a.32.32 0 0 1-.32-.32V1.6z'
      key='key-0'
    />
    <path
      d='M6.38 3.251a.218.218 0 0 0-.28 0L3.277 5.704a.21.21 0 0 0-.064.236c.032.085.114.14.204.14h.423a.32.32 0 0 1 .32.32v1.92c0 .176.144.32.32.32h.64a.32.32 0 0 0 .32-.32v-.8a.8.8 0 1 1 1.6 0v.8c0 .176.144.32.32.32H8a.32.32 0 0 0 .32-.32V6.4a.32.32 0 0 1 .32-.32h.423c.09 0 .172-.056.204-.14a.21.21 0 0 0-.064-.237L6.38 3.251zm8.975 2.659a1.28 1.28 0 0 0-1.16-1.39l-.64-.058a.64.64 0 1 0-.115 1.275l.32.028a.32.32 0 0 1 .29.348l-.698 7.647a.32.32 0 0 1-.347.29L4.4 13.265a.64.64 0 1 0-.113 1.274l8.922.816a1.28 1.28 0 0 0 1.392-1.16l.753-8.286z'
      key='key-1'
    />
  </Fragment>
)

const defaultProps = {
  children,
  viewBox,
  fillColor: null,
  fillColorRule: '&&& path, &&& use, &&& g',
  sizes,
  size: null
}

const propTypes = {
  fillColor: PropTypes.string,
  fillColorRule: PropTypes.string,
  viewBox: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  size: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      height: PropTypes.number.isRequired,
      width: PropTypes.number.isRequired
    })
  ]),
  sizes: PropTypes.shape({
    height: PropTypes.number,
    width: PropTypes.number
  })
}

export default Object.assign(Image, {
  getDimensions,
  getCss,
  defaultProps,
  propTypes,
  displayName: 'IconMyDesigns'
})
