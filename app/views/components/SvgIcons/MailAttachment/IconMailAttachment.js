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
      d="M20.25 19.881a.364.364 0 0 1-.359.369H5.11a.364.364 0 0 1-.359-.369v-7.438l2.634-1.827-.855-1.232-3.279 2.274v8.223c0 1.03.83 1.869 1.859 1.869h14.78a1.864 1.864 0 0 0 1.859-1.869v-8.223L18.47 9.384l-.855 1.232 2.634 1.827v7.438z"
      key="key-0"
    />
    <path
      d="M10.083 15.75h4.834l3.62 2.84.926-1.18-4.027-3.16H9.564l-4.027 3.16.926 1.18z"
      key="key-1"
    />
    <path
      d="M20.614 11.357l-5 3 .772 1.286 5-3zm-17 1.286l5 3 .772-1.286-5-3z"
      key="key-2"
    />
    <path
      d="M18.75 14V3.815c0-.848-.645-1.565-1.483-1.565H7.733c-.838 0-1.483.717-1.483 1.565V14h1.5V3.815c0-.053.011-.065-.017-.065h9.534c-.028 0-.017.012-.017.065V14h1.5z"
      key="key-3"
    />
    <path
      d="M10 6.25h2v-1.5h-2zm0 2h5v-1.5h-5zm-1 3h7v-1.5H9zm0 2h7v-1.5H9z"
      key="key-4"
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
  displayName: 'IconMailAttachment'
})
