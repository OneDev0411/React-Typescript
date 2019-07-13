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
      d='M2.449 4h19.102C22.904 4 24 5.053 24 6.353v11.294c0 1.3-1.096 2.353-2.449 2.353H2.449C1.096 20 0 18.947 0 17.647V6.353C0 5.053 1.096 4 2.449 4zm0 1.882a.48.48 0 0 0-.49.47v11.295c0 .26.22.47.49.47h19.102c.27 0 .49-.21.49-.47V6.353a.48.48 0 0 0-.49-.47H2.449zm2.204 8.47c-.541 0-.98-.42-.98-.94s.439-.941.98-.941h3.674c.54 0 .98.421.98.94 0 .52-.44.942-.98.942H4.653zm0 2.824c-.541 0-.98-.42-.98-.94s.439-.942.98-.942h8.082c.54 0 .98.421.98.941s-.44.941-.98.941H4.653zM16.408 6.824h2.939c.947 0 1.714.737 1.714 1.647v2.823c0 .91-.767 1.647-1.714 1.647h-2.939c-.947 0-1.714-.737-1.714-1.647V8.471c0-.91.767-1.647 1.714-1.647zm.245 1.882v2.353h2.449V8.706h-2.449z'
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
  displayName: 'IconMailer'
})
