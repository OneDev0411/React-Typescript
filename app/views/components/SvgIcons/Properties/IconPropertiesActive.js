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
      fill="#0945eb"
      d="M19 11a5.006 5.006 0 0 1 5 5c0 3.17-4.457 7.663-4.646 7.853a.5.5 0 0 1-.708 0C18.457 23.663 14 19.17 14 16a5.006 5.006 0 0 1 5-5zm0 6.75a1.75 1.75 0 1 0 0-3.5 1.75 1.75 0 0 0 0 3.5zM14 9l.009-5.69a.25.25 0 0 0-.395-.2l-4.4 3.14a.5.5 0 0 0-.209.407V19.46a.251.251 0 0 0 .395.2l2.691-1.927a1 1 0 0 1 1.162 1.627l-4.375 3.126a1.5 1.5 0 0 1-1.771-.02L.6 17.586a1.508 1.508 0 0 1-.6-1.2V1.5A1.5 1.5 0 0 1 2.427.32l5.301 4.093a.5.5 0 0 0 .6.01l5.8-4.143a1.5 1.5 0 0 1 1.745 0l6.499 4.642c.393.282.627.736.628 1.22V9a1 1 0 0 1-2 0V6.658a.5.5 0 0 0-.205-.404l-4.4-3.14a.25.25 0 0 0-.395.2V9a1 1 0 0 1-2 0zM7 19.385V6.627a.5.5 0 0 0-.2-.4l-4.4-3.4a.25.25 0 0 0-.4.2v12.858a.5.5 0 0 0 .2.4l4.4 3.3a.25.25 0 0 0 .4-.2z"
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
  displayName: 'IconPropertiesActive'
})
