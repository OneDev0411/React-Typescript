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
      d='M12 0C9.627 0 7.307.704 5.333 2.022a12.001 12.001 0 0 0 4.325 21.747A12 12 0 0 0 24 12 12.01 12.01 0 0 0 12 0zm.25 5a1.495 1.495 0 0 1 1.385.926 1.496 1.496 0 0 1-.325 1.635A1.5 1.5 0 1 1 12.25 5zm2.25 13.5h-4a.997.997 0 0 1-1-1 .997.997 0 0 1 1-1h.75a.25.25 0 0 0 .25-.25v-4.5a.25.25 0 0 0-.25-.25h-.75a.997.997 0 0 1-1-1 .997.997 0 0 1 1-1h1a2 2 0 0 1 2 2v4.75a.25.25 0 0 0 .25.25h.75a.997.997 0 0 1 1 1 .997.997 0 0 1-1 1z'
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
  displayName: 'IconInfoFilled'
})
