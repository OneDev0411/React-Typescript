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
    <path
      d='M2.734 17.148a.838.838 0 0 1 .096-.005h3.95V8.868a.838.838 0 0 1-.097.006h-3.95v8.274zm0 1.804v1.055c0 1.207.91 2.178 2.023 2.178s2.023-.971 2.023-2.178v-1.049H2.83a.838.838 0 0 1-.096-.006zm0-11.893h3.95c.032 0 .064.002.096.005v-.212a2.3 2.3 0 0 0-.217-.98L4.757 2.017 2.95 5.874a2.3 2.3 0 0 0-.216.978v.207zM1 7.968a.976.976 0 0 1 0-.003V6.853c0-.618.135-1.227.394-1.779L3.332.935C3.599.364 4.15 0 4.757 0c.606 0 1.158.364 1.425.935l1.937 4.138c.26.553.395 1.162.395 1.78v13.154C8.514 22.208 6.836 24 4.757 24S1 22.208 1 20.007V7.967zm12.33 5.393h1.546c.479 0 .867.407.867.908 0 .501-.388.907-.867.907H13.33v6.404c0 .334.259.605.578.605h5.78c.32 0 .578-.271.578-.605V2.42a.592.592 0 0 0-.578-.605h-5.78a.592.592 0 0 0-.578.605v1.93h1.546c.479 0 .867.406.867.908 0 .5-.388.907-.867.907H13.33V8.85h1.546c.479 0 .867.406.867.908 0 .5-.388.907-.867.907H13.33v2.696zM13.908 0h5.78C20.965 0 22 1.084 22 2.42v19.16c0 1.336-1.035 2.42-2.312 2.42h-5.78c-1.277 0-2.312-1.084-2.312-2.42V2.42c0-1.336 1.035-2.42 2.312-2.42zm2.712 21.02a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z'
      key='key-0'
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
  displayName: 'IconPencilRuler'
})
