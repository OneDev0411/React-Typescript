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

const width = '255'
const height = '255'
const viewBox = '0 0 255 255'

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
      d="M240.752 78.298c-1.349 0-2.718.253-4.075.728V12.5c0-6.893-5.607-12.5-12.5-12.5H31.044c-6.893 0-12.5 5.607-12.5 12.5v66.524c-1.357-.474-2.726-.727-4.074-.727-5.45 0-11.316 4.101-11.316 13.103v146.322c0 9.65 7.851 17.5 17.5 17.5h213.915c9.649 0 17.5-7.85 17.5-17.5V91.4c0-9.002-5.866-13.102-11.317-13.102zM33.544 15h188.133v74.376c0 .063.008.126.01.188l-90.731 69.912c-.78.601-2.03.959-3.345.959-1.314 0-2.563-.357-3.343-.958L33.27 89.359a7.5 7.5 0 00.274-1.983V15zm203.525 222.723c0 1.355-1.145 2.5-2.5 2.5H20.654c-1.355 0-2.5-1.145-2.5-2.5V96.647l96.958 74.711c3.412 2.63 7.851 4.077 12.499 4.077 4.648 0 9.087-1.447 12.5-4.077l96.958-74.711v141.076z"
      key="key-0"
    />
    <path
      d="M75.309 48.938h32.838c4.142 0 7.499-3.357 7.499-7.5s-3.357-7.5-7.499-7.5H75.309c-4.142 0-7.5 3.357-7.5 7.5s3.358 7.5 7.5 7.5zM75.309 79.15h101c4.143 0 7.5-3.357 7.5-7.5s-3.357-7.5-7.5-7.5h-101c-4.142 0-7.5 3.357-7.5 7.5s3.358 7.5 7.5 7.5zM75.309 109.363h101c4.143 0 7.5-3.357 7.5-7.5s-3.357-7.5-7.5-7.5h-101a7.5 7.5 0 00-7.5 7.5 7.5 7.5 0 007.5 7.5z"
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
  displayName: 'IconEmailRead'
})
