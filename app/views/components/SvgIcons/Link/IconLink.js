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
      d='M10.458 18.374l.003-.003a1 1 0 1 1 1.414 1.415l-2.736 2.735a4.785 4.785 0 0 1-6.771 0l-.892-.891a4.787 4.787 0 0 1 0-6.77l5.8-5.8a4.791 4.791 0 0 1 6.771 0l.893.892a1.003 1.003 0 1 1-1.418 1.418l-.893-.892a2.789 2.789 0 0 0-3.942 0l-5.8 5.8a2.787 2.787 0 0 0 0 3.941l.892.891a2.853 2.853 0 0 0 3.942 0l2.737-2.736zM22.526 2.363l-.005-.001a4.786 4.786 0 0 1 0 6.771l-5.8 5.8a4.752 4.752 0 0 1-3.385 1.4 4.751 4.751 0 0 1-3.384-1.4 1 1 0 1 1 1.415-1.412c.521.524 1.23.818 1.969.816.74.002 1.45-.292 1.971-.817l5.8-5.8a2.786 2.786 0 0 0 0-3.942l-.893-.893a2.79 2.79 0 0 0-3.941 0l-2.9 2.9a1 1 0 0 1-1.414-1.414l2.905-2.9a4.8 4.8 0 0 1 6.77 0l.892.892z'
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
  displayName: 'IconLink'
})
