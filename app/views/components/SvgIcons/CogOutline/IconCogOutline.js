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
      d='M7.844 3.518l.002.001a.792.792 0 0 0 1.09-.456l.435-1.206a2.795 2.795 0 0 1 5.265 0l.43 1.21a.793.793 0 0 0 1.086.451l1.16-.55a2.794 2.794 0 0 1 3.72 3.724l-.552 1.16a.794.794 0 0 0 .451 1.09l1.212.431a2.795 2.795 0 0 1 0 5.265l-1.21.43a.795.795 0 0 0-.451 1.09l.553 1.166a2.794 2.794 0 0 1-3.72 3.712l-1.161-.551a.793.793 0 0 0-1.09.454l-.435 1.213a2.795 2.795 0 0 1-5.26-.002l-.43-1.21a.793.793 0 0 0-1.089-.45l-1.158.55a2.794 2.794 0 0 1-3.726-3.719l.551-1.16a.795.795 0 0 0-.454-1.091l-1.212-.435a2.793 2.793 0 0 1 0-5.26l1.212-.431a.794.794 0 0 0 .449-1.096l-.549-1.162a2.794 2.794 0 0 1 3.721-3.717l1.16.549zM5.83 4.778a.794.794 0 0 0-1.057 1.056l.545 1.157a2.793 2.793 0 0 1-1.586 3.838l-1.207.43a.794.794 0 0 0 .001 1.493l1.21.434a2.795 2.795 0 0 1 1.588 3.833l-.551 1.16a.793.793 0 0 0 1.06 1.055l1.159-.55a2.794 2.794 0 0 1 3.832 1.587l.428 1.205a.795.795 0 0 0 1.494 0l.434-1.21a2.792 2.792 0 0 1 3.832-1.588l1.155.549a.795.795 0 0 0 1.059-1.05l-.55-1.16a2.793 2.793 0 0 1 1.586-3.832l1.21-.431a.794.794 0 0 0 0-1.497l-1.21-.43a2.794 2.794 0 0 1-1.588-3.834l.552-1.16a.795.795 0 0 0-1.056-1.059l-1.162.552a2.793 2.793 0 0 1-3.825-1.588l-.43-1.21a.794.794 0 0 0-1.5.004l-.434 1.204a2.793 2.793 0 0 1-3.832 1.59L5.83 4.777zm6.167 12.349a5.122 5.122 0 1 1 0-10.244 5.122 5.122 0 0 1 0 10.244zm0-2a3.122 3.122 0 1 0 0-6.244 3.122 3.122 0 0 0 0 6.244z'
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
  displayName: 'IconCogOutline'
})
