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
  if (
    size &&
    typeof size.width === 'number' &&
    typeof size.height === 'number'
  ) {
    return size
  }

  return size && sizes[size] ? sizes[size] : { width, height }
}

const getCss = (size, sizes, fillColor, fillColorRule, noStyles) => {
  if (noStyles) {
    return ''
  }

  const dimensions = getDimensions(size, sizes)
  const fillRule =
    fillColor && fillColorRule ? `${fillColorRule}{ fill: ${fillColor}; }` : ''

  return css`
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    ${fillRule}
  `
}

const propsToCss = ({ size, sizes, fillColor, fillColorRule, noStyles }) =>
  getCss(size, sizes, fillColor, fillColorRule, noStyles)

const Image = styled.svg`
  ${propsToCss}
`

const children = (
  <Fragment>
    <path
      d="M14 9a1 1 0 0 0 2 0V3.314a.25.25 0 0 1 .395-.2l4.4 3.14a.5.5 0 0 1 .205.404V9a1 1 0 0 0 2 0V6.143c0-.485-.235-.939-.628-1.221L15.873.28a1.5 1.5 0 0 0-1.745 0l-5.8 4.144a.5.5 0 0 1-.6-.011L2.427.32A1.5 1.5 0 0 0 0 1.5v14.885c.001.472.223.916.6 1.2l6.507 4.881a1.5 1.5 0 0 0 1.771.02l4.375-3.126a1 1 0 0 0-1.162-1.627L9.4 19.66a.251.251 0 0 1-.395-.2V6.657a.5.5 0 0 1 .209-.407l4.4-3.14a.25.25 0 0 1 .395.2L14 9zM7 19.385a.25.25 0 0 1-.4.2l-4.4-3.3a.5.5 0 0 1-.2-.4V3.027a.25.25 0 0 1 .4-.2l4.4 3.4a.5.5 0 0 1 .2.4v12.758zM19 11a5.006 5.006 0 0 1 5 5c0 3.17-4.457 7.663-4.646 7.853a.5.5 0 0 1-.708 0C18.457 23.663 14 19.17 14 16a5.006 5.006 0 0 1 5-5zm3 5.002a3.006 3.006 0 0 0-3-3.003 3.005 3.005 0 0 0-3 3c0 .844.687 2.265 1.862 3.858.385.523.773 1.004 1.138 1.43.365-.426.753-.907 1.138-1.43C21.313 18.264 22 16.843 22 16.002zm-3 1.747a1.75 1.75 0 1 1 0-3.5 1.75 1.75 0 0 1 0 3.5z"
      key="key-0"
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
  displayName: 'IconProperties'
})
