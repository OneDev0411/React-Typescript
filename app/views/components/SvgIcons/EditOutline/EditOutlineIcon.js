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
      d='M19.593 0a4.388 4.388 0 0 0-3.108 1.32L1.99 15.816a.75.75 0 0 0-.196.344l-1.77 6.904a.75.75 0 0 0 .912.912l6.905-1.77a.75.75 0 0 0 .344-.197l14.5-14.5a4.388 4.388 0 0 0 .036-6.229A4.39 4.39 0 0 0 19.593 0zM22.5 4.397a2.888 2.888 0 0 1-.87 2.046L7.27 20.803 1.79 22.21l1.405-5.479L17.551 2.375a2.888 2.888 0 0 1 4.108-.035c.544.546.846 1.287.841 2.057z'
      key='key-0'
    />
    <path
      d='M16.076 2.79l5.134 5.134a.75.75 0 0 0 1.06-1.06L17.136 1.73a.75.75 0 0 0-1.06 1.06zm-2.094 2.094l5.134 5.134a.75.75 0 0 0 1.06-1.06l-5.134-5.134a.75.75 0 0 0-1.06 1.06zM1.991 16.876l5.14 5.129a.75.75 0 1 0 1.059-1.062l-5.14-5.129a.75.75 0 1 0-1.059 1.062z'
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
  displayName: 'EditOutlineIcon'
})
