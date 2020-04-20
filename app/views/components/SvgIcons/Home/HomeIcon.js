import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '-4 -4 24 24'

const sizes = {
  small: { width: 16, height: 16 },
  medium: { width: 24, height: 24 },
  large: { width: 36, height: 36 }
}

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
      d='M7.953 2.132c-1.6 0-2.897 1.31-2.897 2.925 0 1.615 1.297 2.925 2.897 2.925 1.6 0 2.897-1.31 2.897-2.925-.001-1.615-1.298-2.925-2.897-2.925zm-.882 2.925c0-.492.395-.89.882-.89s.882.399.882.89c0 .492-.395.89-.882.89a.886.886 0 0 1-.882-.89z'
      key='key-0'
    />
    <path
      d='M19.243 7.771l-9.51-9.596-.002-.002a2.499 2.499 0 0 0-3.561-.011l-.003.002-9.506 9.607a1.025 1.025 0 0 0 .001 1.439 1 1 0 0 0 1.425-.001l1.302-1.316v9.753c0 .562.451 1.017 1.007 1.017H15.51c.556 0 1.007-.455 1.007-1.017v-9.75l1.303 1.315a1 1 0 0 0 1.425-.001 1.026 1.026 0 0 0-.002-1.439zm-9.275 8.858h-4.03v-3.561c0-.54.212-1.057.59-1.439a2.003 2.003 0 0 1 2.849.001c.378.382.59.899.59 1.439v3.56zm4.533 0h-2.519v-3.561a4.092 4.092 0 0 0-1.18-2.877c-.756-.763-1.781-1.192-2.85-1.192s-2.094.429-2.85 1.192a4.087 4.087 0 0 0-1.18 2.877v3.561H1.404V5.857L7.59-.395l.001-.001a.497.497 0 0 1 .711.004l.003.003 6.196 6.251v10.767z'
      key='key-1'
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
  displayName: 'HomeIcon'
})
