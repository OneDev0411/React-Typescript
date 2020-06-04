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
      d='M5.25.247h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM5.25 8.747h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM5.25 17.247h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM13.75.247h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM13.75 8.747h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM13.75 17.247h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM22.25.247h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM22.25 8.747h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5zM22.25 17.247h-3.5a1.5 1.5 0 0 0-1.5 1.5v3.5a1.5 1.5 0 0 0 1.5 1.5h3.5a1.5 1.5 0 0 0 1.5-1.5v-3.5a1.5 1.5 0 0 0-1.5-1.5z'
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
  displayName: 'IconGalleryView'
})
