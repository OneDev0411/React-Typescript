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
      d='M22.5 9.5h-1.862a8.952 8.952 0 0 0-.763-1.84l1.317-1.316a1.5 1.5 0 0 0 0-2.122l-1.415-1.413a1.5 1.5 0 0 0-2.121 0l-1.318 1.317a8.906 8.906 0 0 0-1.838-.763V1.5A1.5 1.5 0 0 0 13 0h-2a1.5 1.5 0 0 0-1.5 1.5v1.863a8.969 8.969 0 0 0-1.839.763L6.343 2.809a1.5 1.5 0 0 0-2.121 0L2.807 4.223a1.5 1.5 0 0 0 0 2.122l1.318 1.317A8.878 8.878 0 0 0 3.362 9.5H1.5A1.5 1.5 0 0 0 0 11v2a1.5 1.5 0 0 0 1.5 1.5h1.862c.185.64.44 1.257.763 1.839l-1.319 1.319a1.5 1.5 0 0 0 0 2.121l1.414 1.414a1.545 1.545 0 0 0 2.122 0l1.318-1.317a8.98 8.98 0 0 0 1.84.764v1.86A1.5 1.5 0 0 0 11 24h2a1.5 1.5 0 0 0 1.5-1.5v-1.86a8.97 8.97 0 0 0 1.839-.763l1.318 1.317a1.5 1.5 0 0 0 2.121 0l1.414-1.414a1.5 1.5 0 0 0 0-2.121l-1.317-1.317c.322-.583.578-1.2.763-1.84H22.5A1.5 1.5 0 0 0 24 13v-2a1.5 1.5 0 0 0-1.5-1.5zM12 17a5 5 0 1 1 0-9.999A5 5 0 0 1 12 17z'
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
  displayName: 'IconCog'
})
