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
      d="M20.878 16.826c.46-.141.816-.576.866-1.092a1.286 1.286 0 0 0-.67-1.257l-8.982-4.115a1.32 1.32 0 0 0-1.455.27c-.377.375-.49.94-.287 1.432l.01.025 4.095 8.94c.266.5.762.765 1.278.715.516-.05.952-.406 1.104-.902l1.067-2.938 2.974-1.078zm-.98-1.24l-2.835 1.028-.33.12-1.148 3.164-3.641-7.954 7.954 3.643z"
      key="key-0"
    />
    <path
      d="M19.727 11.626a8.75 8.75 0 1 0-8.105 8.102l-.101-1.496a7.25 7.25 0 1 1 6.71-6.715l1.496.109z"
      key="key-1"
    />
    <path
      d="M16.726 10.24a5.323 5.323 0 1 0-6.486 6.486l.376-1.452a3.823 3.823 0 1 1 4.658-4.658l1.452-.376z"
      key="key-2"
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
  displayName: 'IconClicked'
})
