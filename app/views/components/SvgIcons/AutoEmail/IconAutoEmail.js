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
      d="M17 21.75a4.25 4.25 0 1 0 0-8.5 4.25 4.25 0 0 0 0 8.5zm0-1.5a2.75 2.75 0 1 1 0-5.5 2.75 2.75 0 0 1 0 5.5z"
      key="key-0"
    />
    <path
      d="M17.25 17.25V16h-1.5v2.75h2.75v-1.5zm-5.25-2H4.643c-.212 0-.393-.187-.393-.429V6.18c0-.242.181-.429.393-.429h13.714c.212 0 .393.187.393.429v6.456h1.5V6.179c0-1.06-.842-1.929-1.893-1.929H4.643c-1.05 0-1.893.869-1.893 1.929v8.642c0 1.06.842 1.929 1.893 1.929H12v-1.5z"
      key="key-1"
    />
    <path
      d="M12.005 11.036l-7.602-6.2-.948 1.162 8.54 6.966 7.974-6.378-.938-1.172z"
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
  displayName: 'IconAutoEmail'
})
