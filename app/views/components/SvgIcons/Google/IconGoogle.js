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
      fill='#D75140'
      d='M6.093 7.4a.5.5 0 0 0 .68-.06 7.002 7.002 0 0 1 5.133-2.332 7.015 7.015 0 0 1 5.191 2.202.5.5 0 0 0 .71 0l2.922-2.736a.499.499 0 0 0 0-.708A12.005 12.005 0 0 0 11.72.003a12.025 12.025 0 0 0-8.83 4.162.499.499 0 0 0 .1.739L6.094 7.4z'
      key='key-0'
    />
    <path
      fill='#F1BE42'
      d='M5.233 14.777a.499.499 0 0 0 .14-.529 6.865 6.865 0 0 1 0-4.453.498.498 0 0 0-.16-.549L1.94 6.641a.5.5 0 0 0-.76.17 11.89 11.89 0 0 0 .15 10.632.5.5 0 0 0 .78.14l3.122-2.806z'
      key='key-1'
    />
    <path
      fill='#5386EC'
      d='M24 10.494a.499.499 0 0 0-.5-.499H13.496a.5.5 0 0 0-.5.5v3.993a.498.498 0 0 0 .5.499h4.842a6.778 6.778 0 0 1-1.14 1.667.5.5 0 0 0 0 .669l2.67 2.995a.5.5 0 0 0 .73 0A11.968 11.968 0 0 0 24 12.59v-2.097z'
      key='key-2'
    />
    <path
      fill='#5AA55D'
      d='M15.517 18.441a.5.5 0 0 0-.58-.12 6.946 6.946 0 0 1-8.104-1.627.501.501 0 0 0-.7 0l-3.001 2.675a.5.5 0 0 0 0 .71 12.025 12.025 0 0 0 15.006 2.246.502.502 0 0 0 .225-.569.5.5 0 0 0-.105-.19l-2.741-3.125z'
      key='key-3'
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
  displayName: 'IconGoogle'
})
