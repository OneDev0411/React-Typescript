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
      d='M23.16 15.4l-7.79 7.79-5.076 1.016 1.015-5.076.16-.16 7.63-7.631c1.12-1.12 2.934-1.12 4.084.032l-.023-.024a2.863 2.863 0 0 1 0 4.053zm-8.53 6.41l7.47-7.471c.256-.257.4-.604.4-.966 0-.361-.144-.708-.43-.997l.022.023a1.366 1.366 0 0 0-1.932 0l-7.47 7.47-.484 2.425 2.424-.485zM6 7.5A3.75 3.75 0 1 0 6 0a3.75 3.75 0 0 0 0 7.5zM6 6a2.25 2.25 0 1 1 0-4.5A2.25 2.25 0 0 1 6 6z'
      key='key-0'
    />
    <path
      d='M2.321 16.5l.75 7.5H8.93l.75-7.5H12v-3a6 6 0 0 0-12 0v3h2.321zM10.5 15H8.321l-.75 7.5H4.43L3.68 15H1.5v-1.5a4.5 4.5 0 1 1 9 0V15z'
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
  displayName: 'EditRolesIcon'
})
