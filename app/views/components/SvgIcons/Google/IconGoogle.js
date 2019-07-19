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
  if (size && typeof size.width === 'number' && typeof size.height === 'number') {
    return size
  }
  return size && sizes[size]
    ? sizes[size]
    : { width, height }
}

const getCss = (size, sizes, fillColor, fillColorRule, noStyles) => {
  if (noStyles) { return '' }
  const dimensions = getDimensions(size, sizes)
  const fillRule = fillColor && fillColorRule ? `${fillColorRule}{ fill: ${fillColor}; }` : ''
  return css`
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    ${fillRule}
  `
}

const propsToCss = ({
  size,
  sizes,
  fillColor,
  fillColorRule,
  noStyles
}) => getCss(size, sizes, fillColor, fillColorRule, noStyles)

const Image = styled.svg`${propsToCss}`

const children = (
  <Fragment>
    <g
      fill='none'
      fillRule='evenodd'
      key='key-0'
    >
      <path
        fill='#4285F4'
        d='M20.046 20.903l-3.931-3.172a7.075 7.075 0 0 0 2.5-3.273h-6.542V9.513h11.669a12.05 12.05 0 0 1 .194 3.734 11.972 11.972 0 0 1-3.89 7.656z'
      />
      <path
        fill='#34A853'
        d='M1.31 17.456l4.028-3.129a7.058 7.058 0 0 0 10.773 3.407l3.934 3.17A11.956 11.956 0 0 1 12 24a12 12 0 0 1-10.69-6.544z'
      />
      <path
        fill='#FBBC05'
        d='M1.36 6.445l4.027 3.094A7.04 7.04 0 0 0 4.945 12c0 .847.15 1.66.424 2.413l-4.052 3.059A11.949 11.949 0 0 1 0 12c0-2.005.492-3.894 1.36-5.555z'
      />
      <path
        fill='#EA4335'
        d='M5.387 9.539L1.36 6.445A11.999 11.999 0 0 1 12 0a11.96 11.96 0 0 1 8.505 3.535l-3.484 3.51A7.057 7.057 0 0 0 5.387 9.539z'
      />
    </g>
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
  viewBox: PropTypes.string,
  children: PropTypes.node,
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
  displayName: 'IconGoogle'
})
