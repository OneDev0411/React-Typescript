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
      d="M3.5 4.25h17a2.25 2.25 0 0 1 2.25 2.25v11a2.25 2.25 0 0 1-2.25 2.25h-17a2.25 2.25 0 0 1-2.25-2.25v-11A2.25 2.25 0 0 1 3.5 4.25zm0 1.5a.75.75 0 0 0-.75.75v11c0 .414.336.75.75.75h17a.75.75 0 0 0 .75-.75v-11a.75.75 0 0 0-.75-.75h-17z"
      key="key-0"
    />
    <path
      d="M5.5 13.25h3.75v-1.5H5.5zm0 3h8.25v-1.5H5.5zm10-9.5h3a1.5 1.5 0 0 1 1.5 1.5v3a1.5 1.5 0 0 1-1.5 1.5h-3a1.5 1.5 0 0 1-1.5-1.5v-3a1.5 1.5 0 0 1 1.5-1.5zm0 1.5v3h3v-3h-3z"
      key="key-1"
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
  displayName: 'IconMail'
})
