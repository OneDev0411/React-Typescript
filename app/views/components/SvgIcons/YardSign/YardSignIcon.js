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
    <path
      fill="#000"
      fillRule="evenodd"
      d="M.39.39C.14.64 0 .98 0 1.334v14a.667.667 0 101.333 0V1.667a.333.333 0 01.334-.334h2.666a.333.333 0 01.334.334v1.166a.333.333 0 01-.334.334h-.666a1 1 0 00-1 1V11a1 1 0 001 1H15a1 1 0 001-1V4.167a1 1 0 00-1-1h-1a.333.333 0 01-.333-.334V1.667A.333.333 0 0114 1.333h1A.667.667 0 1015 0H1.333C.98 0 .641.14.391.39zm11.846 1.041a.333.333 0 01.097.236v1.166a.333.333 0 01-.333.334H6.333A.333.333 0 016 2.833V1.667a.333.333 0 01.333-.334H12c.088 0 .173.035.236.098zM5 4.667a1 1 0 00-1 1v4a1 1 0 001 1h8.667a1 1 0 001-1v-4a1 1 0 00-1-1H5z"
      clipRule="evenodd"
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
  displayName: 'YardSign'
})
