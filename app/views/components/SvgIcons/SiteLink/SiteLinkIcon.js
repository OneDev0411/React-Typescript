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
      fill='#000'
      fillRule='evenodd'
      d='M6.5 1A5.5 5.5 0 0 0 1 6.5v11A5.5 5.5 0 0 0 6.5 23h11a5.5 5.5 0 0 0 5.5-5.5v-1.528a1.833 1.833 0 0 0-3.667 0V17.5c0 1.012-.82 1.833-1.833 1.833h-11A1.833 1.833 0 0 1 4.667 17.5v-11c0-1.013.82-1.833 1.833-1.833h1.528a1.833 1.833 0 0 0 0-3.667H6.5zm15.53 9.308a1.572 1.572 0 0 0 .97-1.45V2.57A1.571 1.571 0 0 0 21.429 1h-6.286a1.572 1.572 0 0 0-1.111 2.682l1.475 1.476a.392.392 0 0 1 0 .556l-5.468 5.467a1.965 1.965 0 0 0 2.779 2.778l5.468-5.468a.394.394 0 0 1 .556 0l1.476 1.476a1.571 1.571 0 0 0 1.712.34z'
      clipRule='evenodd'
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
  displayName: 'SiteLink'
})
