import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const sizes = {}

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
      d='M5.727 5.283l-2-2a1 1 0 0 1 1.414-1.414l2 2a1 1 0 0 1 0 1.414 1.016 1.016 0 0 1-1.414 0zM9.5 4.5a1 1 0 0 1-1-1V1a1 1 0 1 1 2 0v2.5a1 1 0 0 1-1 1zM2.909 9a1 1 0 1 1 0-2h2.5a1 1 0 1 1 0 2h-2.5zm7.818 8.869a1 1 0 1 1 1.414 1.414l-3.4 3.4a4.509 4.509 0 0 1-6.363 0l-1.061-1.06a4.51 4.51 0 0 1 0-6.364l3.4-3.4a1 1 0 1 1 1.414 1.414l-3.4 3.4a2.511 2.511 0 0 0 0 3.536l1.061 1.06a2.57 2.57 0 0 0 3.535 0l3.4-3.4zM19.377 7A4.662 4.662 0 0 1 24 11.576v2A4.544 4.544 0 0 1 19.353 18h-4.476a1 1 0 0 1 0-2h4.476A2.576 2.576 0 0 0 22 13.576v-2A2.7 2.7 0 0 0 19.377 9h-4.5a1 1 0 0 1 0-2h4.5z'
      key='key-0'
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
  displayName: 'IconUnlink'
})
