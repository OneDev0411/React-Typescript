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
      fill='#000'
      d='M4 .747H1.5a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 1.5 1.5H4a1.5 1.5 0 0 0 1.5-1.5v-2.5A1.5 1.5 0 0 0 4 .747zM4 9.247H1.5a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 1.5 1.5H4a1.5 1.5 0 0 0 1.5-1.5v-2.5a1.5 1.5 0 0 0-1.5-1.5zM4 17.747H1.5a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 1.5 1.5H4a1.5 1.5 0 0 0 1.5-1.5v-2.5a1.5 1.5 0 0 0-1.5-1.5zM22.5.747H10a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5v-2.5a1.5 1.5 0 0 0-1.5-1.5zM22.5 9.247H10a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5v-2.5a1.5 1.5 0 0 0-1.5-1.5zM22.5 17.747H10a1.5 1.5 0 0 0-1.5 1.5v2.5a1.5 1.5 0 0 0 1.5 1.5h12.5a1.5 1.5 0 0 0 1.5-1.5v-2.5a1.5 1.5 0 0 0-1.5-1.5z'
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
  displayName: 'ListIcon'
})
