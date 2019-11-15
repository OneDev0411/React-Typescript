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
      d='M1.155 7.4l9.649 4.2a3.008 3.008 0 0 0 2.392 0l9.649-4.2a1.5 1.5 0 0 0 0-2.751L13.2.452a3.009 3.009 0 0 0-2.392 0L1.157 4.646a1.5 1.5 0 0 0 0 2.752l-.002.002z'
      key='key-0'
    />
    <path
      d='M22.844 10.648l-1.244-.542a1 1 0 0 0-.8 1.834l.191.083-8.591 3.736a.99.99 0 0 1-.8 0l-8.592-3.736.192-.083a1 1 0 1 0-.8-1.834l-1.244.541a1.5 1.5 0 0 0 0 2.752l9.644 4.194a3.008 3.008 0 0 0 2.392 0l9.649-4.193a1.5 1.5 0 0 0 0-2.752h.003z'
      key='key-1'
    />
    <path
      d='M22.844 16.6l-1.244-.539a1 1 0 0 0-.8 1.834l.191.083-8.591 3.736a1 1 0 0 1-.8 0l-8.592-3.736.192-.078a1 1 0 1 0-.8-1.834l-1.244.54a1.5 1.5 0 0 0 0 2.752l9.644 4.19a3.008 3.008 0 0 0 2.392 0l9.645-4.193a1.5 1.5 0 0 0 0-2.753l.007-.002z'
      key='key-2'
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
  displayName: 'IconTemplate'
})
