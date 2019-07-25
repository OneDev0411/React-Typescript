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
      d='M21.941 3.607L18.87.554A1.912 1.912 0 0 0 17.527 0H8.9A1.9 1.9 0 0 0 7 1.9V5H3.4a1.9 1.9 0 0 0-1.9 1.9v15.21A1.9 1.9 0 0 0 3.4 24h11.7a1.9 1.9 0 0 0 1.9-1.895V19h3.6a1.9 1.9 0 0 0 1.9-1.895V4.949c0-.504-.2-.988-.559-1.342zM14.5 22H4a.5.5 0 0 1-.5-.5v-14A.5.5 0 0 1 4 7h7.784a.5.5 0 0 1 .35.143L14.85 9.8a.5.5 0 0 1 .15.357V21.5a.5.5 0 0 1-.5.5zm5.5-5h-2.75a.25.25 0 0 1-.25-.25v-6.8c0-.503-.201-.986-.558-1.341L13.37 5.554A1.9 1.9 0 0 0 12.028 5H9.25A.25.25 0 0 1 9 4.75V2.5a.5.5 0 0 1 .5-.5l7.756-.026a.5.5 0 0 1 .351.143L20.35 4.8a.5.5 0 0 1 .15.357V16.5a.5.5 0 0 1-.5.5z'
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
  displayName: 'IconCopy'
})
