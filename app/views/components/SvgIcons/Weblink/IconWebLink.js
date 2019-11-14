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

const sizes = sanitizeSizes({})

const Image = styled.svg`
  ${propsToCss}
`

const children = (
  <Fragment>
    <g fill="#000" clipPath="url(#clip0)" key="key-0">
      <path d="M8.8 17.769a.25.25 0 01.147-.34 1 1 0 00-.324-1.938h-.4a.25.25 0 01-.244-.2 15.129 15.129 0 01-.352-3.3 15.3 15.3 0 01.254-2.8.25.25 0 01.246-.2h8a.249.249 0 01.245.2c.075.395.138.8.18 1.242a.999.999 0 101.99-.189 15.574 15.574 0 00-.123-.968.25.25 0 01.248-.289h2.805a.25.25 0 01.239.178c.13.43.231.869.3 1.313a1 1 0 001.977-.3 12 12 0 10-11.866 13.813.984.984 0 00.963-.81c.299-1.522-2.276-1.004-4.285-5.412zM5.92 15.2a.252.252 0 01-.246.3h-2.73a.252.252 0 01-.236-.166 9.886 9.886 0 01-.177-6.164.25.25 0 01.24-.179h2.806a.25.25 0 01.248.288 17.876 17.876 0 00-.2 2.712A17.2 17.2 0 005.92 15.2zM8.847 7a.25.25 0 01-.231-.346A10.055 10.055 0 0111.98 2.26a.25.25 0 01.29 0 10.1 10.1 0 013.36 4.385.25.25 0 01-.23.346L8.847 7zm11.687-.386a.25.25 0 01-.21.386h-2.263a.25.25 0 01-.237-.171 13.156 13.156 0 00-1.743-3.483.25.25 0 01.312-.371 10.16 10.16 0 014.141 3.63v.009zM7.857 2.961a.25.25 0 01.311.37 13.181 13.181 0 00-1.746 3.488.249.249 0 01-.237.172H3.923a.25.25 0 01-.21-.385 10.042 10.042 0 014.144-3.645zm-3.8 14.928a.25.25 0 01.2-.4h2.091a.25.25 0 01.234.163 12.862 12.862 0 001.583 3 .25.25 0 01-.311.371 10.048 10.048 0 01-3.795-3.134h-.002z" />
      <path d="M23.485 16.789l-9.507-4.139a1.032 1.032 0 00-1.326 1.33l4.136 9.5a.876.876 0 00.813.525 1.077 1.077 0 001-.753l1.072-3.452a.251.251 0 01.167-.165l3.414-1.035a1.075 1.075 0 00.735-.8.884.884 0 00-.504-1.011z" />
    </g>
    <defs key="key-1">
      <clipPath id="clip0">
        <path fill="#fff" d="M0 0h24v24H0z" />
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
  displayName: 'Weblink'
})
