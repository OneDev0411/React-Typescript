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
      d='M23.25 5.25h-10.5a.75.75 0 0 0 0 1.5h8.316l-4.609 3.586-3.305-2.102-.804 1.266 3.75 2.383a.755.755 0 0 0 .863-.04L22.5 7.536v9.715h-9.75a.75.75 0 0 0 0 1.5h10.5A.75.75 0 0 0 24 18V6a.75.75 0 0 0-.75-.75zm0 0'
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#1976d2',
        fillOpacity: '1',
      }}
      key='key-0'
    />
    <path
      d='M13.227.922a.727.727 0 0 0-.614-.156l-12 2.25A.746.746 0 0 0 0 3.75v16.5c0 .36.258.672.613.738l12 2.25a.729.729 0 0 0 .613-.16.745.745 0 0 0 .274-.578v-21a.745.745 0 0 0-.273-.578zm0 0'
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#2196f3',
        fillOpacity: '1',
      }}
      key='key-1'
    />
    <path
      d='M6.75 17.25c-2.066 0-3.75-2.02-3.75-4.5s1.684-4.5 3.75-4.5 3.75 2.02 3.75 4.5-1.684 4.5-3.75 4.5zm0-7.5c-1.242 0-2.25 1.348-2.25 3 0 1.656 1.008 3 2.25 3S9 14.406 9 12.75c0-1.652-1.008-3-2.25-3zm0 0'
      style={{
        stroke: 'none',
        fillRule: 'nonzero',
        fill: '#fafafa',
        fillOpacity: '1',
      }}
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
  displayName: 'IconOutlook'
})
