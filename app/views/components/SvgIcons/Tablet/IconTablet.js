import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const createHelpers = (width, height, css) => {
  // somehow sizes is ending up in markup, even if it is not a valid svg attribute
  // until we have a better solution, just render it empty, instead to '[Object object]'
  const sanitizeSizes = sizes =>
    Object.defineProperty(sizes, 'toString', {
      value: () => '',
      enumerable: false
    })

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
      fillColor && fillColorRule
        ? `${fillColorRule}{ fill: ${fillColor}; }`
        : ''

    return css`
      width: ${dimensions.width}px;
      height: ${dimensions.height}px;
      ${fillRule}
    `
  }

  const propsToCss = ({ size, sizes, fillColor, fillColorRule, noStyles }) =>
    getCss(size, sizes, fillColor, fillColorRule, noStyles)

  return {
    getCss,
    getDimensions,
    propsToCss,
    sanitizeSizes
  }
}

const width = '16'
const height = '16'
const viewBox = '0 0 16 16'

const { getDimensions, getCss, propsToCss, sanitizeSizes } = createHelpers(
  width,
  height,
  css
)

const sizes = sanitizeSizes({})

const Image = styled.svg`
  ${propsToCss}
`

const children = (
  <Fragment>
    <g clipPath="url(#clip0)" key="key-0">
      <path
        fill="#000"
        d="M0 3.667v8.666A1.666 1.666 0 001.667 14h12.666A1.666 1.666 0 0016 12.333V3.667A1.666 1.666 0 0014.333 2H1.667A1.667 1.667 0 000 3.667zm12.333-.334a1 1 0 011 1v7.334a1 1 0 01-1 1H3.667a1 1 0 01-1-1V4.333a1 1 0 011-1h8.666z"
      />
    </g>
    <defs key="key-1">
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0h16v16H0z" />
      </clipPath>
    </defs>
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

Image.propTypes /* remove-proptypes */ = {
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
  displayName: 'IconTablet'
})
