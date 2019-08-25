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
      fill='#0945eb'
      d='M22 0a2 2 0 0 1 2 2v20a2 2 0 0 1-2 2H6a4.001 4.001 0 0 1-4-4v-1H1a1 1 0 1 1 0-2h1v-4H1a1 1 0 1 1 0-2h1V7H1a1 1 0 1 1 0-2h1V4a4 4 0 0 1 4-4h16zM9 19a1 1 0 0 0 1-1v-1a4 4 0 0 1 8 0v1a1 1 0 1 0 2 0v-1a5.996 5.996 0 0 0-3.107-5.25 4.002 4.002 0 0 0-.086-5.613A4.002 4.002 0 0 0 10 8.927a4.002 4.002 0 0 0 1.107 2.823A5.997 5.997 0 0 0 8 17v1a1 1 0 0 0 1 1zm3-10a2 2 0 1 1 4 0 2 2 0 0 1-4 0z'
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
  displayName: 'IconContactsActive'
})
