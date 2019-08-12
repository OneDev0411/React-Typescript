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
      d="M24 14.298c-.003 1.742-.972 3.333-2.5 4.107v.488c0 2.406-1.851 4.086-4.5 4.086h-1.778a1.983 1.983 0 0 1-2.25.951 2.036 2.036 0 0 1-1.482-1.973c0-.924.608-1.733 1.482-1.973a1.983 1.983 0 0 1 2.25.952H17c1.209 0 2.5-.537 2.5-2.043v-.582a1.54 1.54 0 0 1-.5-1.123V9.191c0-3.948-3.134-7.148-7-7.148s-7 3.2-7 7.148v7.997c0 .497-.236.964-.634 1.25-.398.288-.907.36-1.366.194C1.204 17.982.003 16.247.003 14.3c0-1.946 1.2-3.681 2.997-4.331V9.19C3 4.115 7.03 0 12 0s9 4.115 9 9.191v.778c1.798.647 3 2.382 3 4.329zm-12 4.086c-.69 0-1.25-.572-1.25-1.277s.56-1.276 1.25-1.276 1.25.571 1.25 1.276c0 .705-.56 1.277-1.25 1.277zm-2.5-7.66c-.69 0-1.25-.572-1.25-1.276.001-1.913 1.384-3.53 3.239-3.792 1.854-.26 3.614.916 4.12 2.757.508 1.84-.392 3.781-2.108 4.547a.426.426 0 0 0-.25.391v.567c0 .705-.56 1.276-1.25 1.276s-1.25-.571-1.25-1.276v-.567c0-1.184.687-2.255 1.749-2.73.572-.255.872-.9.704-1.514a1.25 1.25 0 0 0-1.372-.92 1.268 1.268 0 0 0-1.082 1.26c0 .705-.56 1.276-1.25 1.276z"
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
  displayName: 'IconSupportActive'
})
