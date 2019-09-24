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
      fill='currentColor'
      d='M23.6 11.22l-7.991-9.987a1.232 1.232 0 0 0-1.383-.416A1.245 1.245 0 0 0 13.373 2v1.5a.25.25 0 0 1-.25.25H1.373A1.251 1.251 0 0 0 .123 5v8.752a.25.25 0 0 0 .25.25h4a2.5 2.5 0 0 1 2.5 2.5V20a.25.25 0 0 0 .25.25h6a.25.25 0 0 1 .25.25V22a1.259 1.259 0 0 0 1.798 1.123c.169-.082.316-.202.431-.35l7.986-9.982a1.228 1.228 0 0 0 .012-1.571z'
      key='key-0'
    />
    <path
      fill='currentColor'
      d='M5.876 16.5a1.5 1.5 0 0 0-1.5-1.5H.973a.249.249 0 0 0-.168.434l4.649 4.238a.25.25 0 0 0 .418-.185l.004-2.987z'
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
  displayName: 'IconForward'
})
