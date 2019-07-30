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
      d='M23.119 19.889l-9.347-17.3a1.964 1.964 0 0 0-.736-.758 2.048 2.048 0 0 0-2.07 0 1.964 1.964 0 0 0-.737.759L.881 19.889a1.89 1.89 0 0 0 .06 1.903c.179.285.43.521.73.685.3.164.638.25.982.25h18.694c.344 0 .682-.086.982-.25.3-.164.551-.4.73-.685a1.89 1.89 0 0 0 .06-1.903zM11 8.669c0-.257.105-.503.293-.685.187-.182.442-.284.707-.284.265 0 .52.102.707.284a.954.954 0 0 1 .293.685v5.815a.955.955 0 0 1-.293.685 1.017 1.017 0 0 1-.707.284c-.265 0-.52-.102-.707-.284a.954.954 0 0 1-.293-.685V8.669zm1.05 11.155h-.028a1.553 1.553 0 0 1-1.057-.416A1.46 1.46 0 0 1 10.5 18.4a1.39 1.39 0 0 1 .403-1.036 1.516 1.516 0 0 1 1.045-.447h.028c.394.001.773.15 1.057.414.284.265.452.626.467 1.008a1.392 1.392 0 0 1-.402 1.039 1.514 1.514 0 0 1-1.048.447z'
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
  displayName: 'IconWarning'
})
