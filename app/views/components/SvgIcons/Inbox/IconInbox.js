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
      d='M21.659 2H2.34A2.341 2.341 0 0 0 0 4.341v15.805a2.342 2.342 0 0 0 2.341 2.342h19.317A2.342 2.342 0 0 0 24 20.146V4.341A2.342 2.342 0 0 0 21.659 2zm-.586 2.341a.585.585 0 0 1 .585.586v.234a.585.585 0 0 1-.26.487l-8.807 5.864a.586.586 0 0 1-.637.008l-9.34-5.898a.585.585 0 0 1-.273-.495v-.2a.585.585 0 0 1 .586-.586h18.146zM2.927 20.146a.585.585 0 0 1-.586-.585V9.281a.585.585 0 0 1 .898-.49l8.43 5.321a1.171 1.171 0 0 0 1.273-.016l7.807-5.205a.586.586 0 0 1 .91.485V19.56a.585.585 0 0 1-.586.585H2.927z'
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
  displayName: 'IconInbox'
})
