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
      d='M7.603 11.528c.182-.43.592-.727 1.066-.784a1.362 1.362 0 0 1 1.107.358c.25.239.39.563.39.888.005.514-.314.98-.809 1.181a1.377 1.377 0 0 1-1.452-.261 1.228 1.228 0 0 1-.302-1.382zm7.66-7.913c-.533 0-.966-.413-.966-.923s.433-.923.967-.923h4.351c1.336 0 2.418 1.033 2.418 2.308v15.846c0 1.275-1.082 2.308-2.418 2.308h-4.351c-.534 0-.967-.414-.967-.923 0-.51.433-.923.967-.923h4.351a.473.473 0 0 0 .484-.462V4.077a.473.473 0 0 0-.484-.462h-4.351zm-3.865 19.68l-8.702-1.187c-.835-.113-1.455-.795-1.454-1.6V4.363c0-.762.557-1.421 1.309-1.574L11.283.73c.5-.102 1.022.017 1.419.324s.628.77.628 1.256v19.386c0 .468-.214.913-.584 1.22-.37.306-.862.444-1.348.378zm-.002-1.866V2.607l-8.22 1.936v15.766l8.22 1.122z'
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
  displayName: 'IconOpenHouseOutline'
})
