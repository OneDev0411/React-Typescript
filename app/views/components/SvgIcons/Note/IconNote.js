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

const width = '22'
const height = '24'
const viewBox = '0 0 22 24'

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
      d="M18.65 0H5.41c-1.85 0-3.35 1.488-3.35 3.324V5.05H.914A.91.91 0 000 5.956c0 .5.409.907.914.907h1.145v4.23H.914a.915.915 0 00-.792.454.9.9 0 000 .906c.164.28.465.454.792.454h1.145v4.23H.914a.91.91 0 00-.914.907c0 .5.409.906.914.906h1.145v1.726c0 1.836 1.5 3.324 3.35 3.324H18.65C20.5 24 22 22.512 22 20.676V3.324C22 1.488 20.5 0 18.65 0zM5.41 22.187c-.404 0-.792-.16-1.077-.443a1.505 1.505 0 01-.446-1.068V18.95h1.218a.91.91 0 00.914-.906.91.91 0 00-.914-.907H3.886v-4.23h1.218A.91.91 0 006.018 12a.91.91 0 00-.914-.907H3.886v-4.23h1.218a.91.91 0 00.914-.907.91.91 0 00-.914-.906H3.886V3.324c0-.834.682-1.51 1.523-1.51H7.57v20.373H5.409zm14.764-1.511c0 .4-.16.785-.446 1.068a1.529 1.529 0 01-1.077.443H9.401V1.813h9.25c.84 0 1.522.677 1.522 1.511v17.352z"
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
  displayName: 'IconNote'
})
