import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

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
      d='M21.659 2H2.34a2.37 2.37 0 0 0-1.655.67A2.258 2.258 0 0 0 0 4.285v15.428c0 .607.247 1.188.686 1.617A2.37 2.37 0 0 0 2.34 22h19.317a2.37 2.37 0 0 0 1.656-.67c.44-.428.686-1.01.686-1.616V4.286c0-.606-.247-1.188-.686-1.617A2.37 2.37 0 0 0 21.66 2zm-.26 1.999c.156 0 .305.06.415.167.11.107.171.253.171.404V4.8a.56.56 0 0 1-.26.475l-9.134 6.012a.595.595 0 0 1-.637.008L2.27 5.249a.577.577 0 0 1-.273-.483V4.57c0-.151.062-.297.172-.404A.593.593 0 0 1 2.58 4H21.4zM2.586 19.996a.593.593 0 0 1-.414-.167.564.564 0 0 1-.171-.404V8.5a.561.561 0 0 1 .305-.497.597.597 0 0 1 .593.018l8.77 5.803a1.192 1.192 0 0 0 1.274-.016l8.148-5.281a.595.595 0 0 1 .826.18c.054.089.084.19.084.293v10.42c0 .152.024.305-.086.413A.593.593 0 0 1 21.5 20l-18.915-.004z'
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
  displayName: 'IconEmailOutlined'
})
