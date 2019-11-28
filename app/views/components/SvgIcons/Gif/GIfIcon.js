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
      fillRule='evenodd'
      d='M3 3v18h18V3H3zm-2-.111C1 1.846 1.846 1 2.889 1H21.11C22.154 1 23 1.846 23 2.889V21.11A1.889 1.889 0 0 1 21.111 23H2.89A1.889 1.889 0 0 1 1 21.111V2.89z'
      clipRule='evenodd'
      key='key-0'
    />
    <path
      fillRule='evenodd'
      d='M16.5 11.25a.75.75 0 0 0-.75.75v6a.75.75 0 0 1-1.5 0v-6a2.25 2.25 0 0 1 2.25-2.25H18a.75.75 0 0 1 0 1.5h-1.5z'
      clipRule='evenodd'
      key='key-1'
    />
    <path
      fillRule='evenodd'
      d='M14.25 15a.75.75 0 0 1 .75-.75h2.25a.75.75 0 0 1 0 1.5H15a.75.75 0 0 1-.75-.75zM12 9.75a.75.75 0 0 1 .75.75V18a.75.75 0 0 1-1.5 0v-7.5a.75.75 0 0 1 .75-.75zM7.5 11.25a.75.75 0 0 0-.75.75v4.5a.75.75 0 1 0 1.5 0v-.75a.75.75 0 0 1 0-1.5H9a.75.75 0 0 1 .75.75v1.5a2.25 2.25 0 0 1-4.5 0V12A2.25 2.25 0 0 1 7.5 9.75H9a.75.75 0 0 1 0 1.5H7.5z'
      clipRule='evenodd'
      key='key-2'
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
  displayName: 'GIfIcon'
})
