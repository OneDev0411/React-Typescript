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
      d='M20 19a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1v-9a1 1 0 0 1 1-1h18a1 1 0 0 1 1 1v9zM6.5 16.876a2.375 2.375 0 1 1 0-4.75.625.625 0 1 0 0-1.25 3.625 3.625 0 0 0 0 7.25.625.625 0 1 0 0-1.25zm2.927-3.508h-.003a.678.678 0 0 1 .376-1.242h1.7a.625.625 0 1 0 0-1.25H9.8a1.928 1.928 0 0 0-1.064 3.532l1.84 1.226a.678.678 0 0 1-.376 1.242H8.5a.625.625 0 1 0 0 1.25h1.697a1.928 1.928 0 0 0 1.07-3.532l-1.84-1.226zm7.7-.367l-.002-1.501a.625.625 0 1 0-1.25 0V13a6.912 6.912 0 0 1-.676 2.979.25.25 0 0 1-.4-.014A6.923 6.923 0 0 1 14.125 13v-1.5a.625.625 0 1 0-1.25 0V13a8.178 8.178 0 0 0 1.625 4.876.625.625 0 0 0 1 0 8.178 8.178 0 0 0 1.627-4.875zm6.58-7.293a1 1 0 0 1 .293.707V22a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2v-.75a.25.25 0 0 1 .25-.25h1.5a.25.25 0 0 1 .25.25v.5c0 .138.112.25.25.25H21.5a.5.5 0 0 0 .5-.5V7.25a.25.25 0 0 0-.25-.25H19a2 2 0 0 1-2-2V2.25a.25.25 0 0 0-.25-.25H6.5a.5.5 0 0 0-.5.5v5.251A.25.25 0 0 1 5.75 8h-1.5A.25.25 0 0 1 4 7.75V2a2 2 0 0 1 2-2h11.586a1 1 0 0 1 .707.294l5.414 5.414z'
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
  displayName: 'IconCsv'
})
