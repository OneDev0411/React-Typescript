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

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const { getDimensions, getCss, propsToCss, sanitizeSizes } = createHelpers(
  width,
  height,
  css
)

const sizes = sanitizeSizes({
  small: { width: 16, height: 16 },
  medium: { width: 24, height: 24 },
  large: { width: 32, height: 32 }
})

const Image = styled.svg`
  ${propsToCss}
`

const children = (
  <Fragment>
    <path
      style={{
        fill: '#d6fb00'
      }}
      d="M0 0h24v24H0z"
      key="key-0"
    />
    <path
      d="M3.2 18.4h17.6v2.4H3.2v-2.4zm7.6-15.2h2.4v12.4h-2.4V3.2z"
      style={{
        fillRule: 'evenodd',
        clipRule: 'evenodd'
      }}
      key="key-1"
    />
    <path
      d="M7.4 11l4.4 4.4 4.4-4.4"
      style={{
        fill: 'none',
        stroke: '#000',
        strokeWidth: '3',
        strokeMiterlimit: '2'
      }}
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
  displayName: 'IconDocuSign'
})
