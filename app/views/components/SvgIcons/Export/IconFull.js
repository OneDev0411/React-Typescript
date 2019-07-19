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
      d='M10.977 10.37V.98c0-.541.458-.98 1.023-.98s1.023.439 1.023.98v9.39l1.323-1.267a1.056 1.056 0 0 1 1.447 0 .95.95 0 0 1 0 1.386l-3.07 2.938c-.4.383-1.047.383-1.447 0l-3.07-2.938a.95.95 0 0 1 0-1.386 1.056 1.056 0 0 1 1.448 0l1.323 1.267zm-7.93 5.059h17.906V8.327a.5.5 0 0 0-.511-.49h-3.07c-.565 0-1.023-.439-1.023-.98 0-.54.458-.98 1.023-.98h3.07c1.413 0 2.558 1.097 2.558 2.45v9.55c0 1.353-1.145 2.45-2.558 2.45h-7.419v1.714h2.814c.565 0 1.023.438 1.023.98 0 .54-.458.979-1.023.979H8.163c-.565 0-1.023-.439-1.023-.98 0-.54.458-.98 1.023-.98h2.814v-1.713H3.558C2.145 20.327 1 19.23 1 17.877v-9.55c0-1.353 1.145-2.45 2.558-2.45h3.07c.565 0 1.023.44 1.023.98 0 .541-.458.98-1.023.98h-3.07a.501.501 0 0 0-.511.49v7.102zm0 1.959v.49c0 .27.229.49.511.49h16.884c.282 0 .511-.22.511-.49v-.49H3.047z'
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
  displayName: 'IconFull'
})
