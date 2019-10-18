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
    <g
      clipPath='url(#s-af0a7d7500-a)'
      key='key-0'
    >
      <path
        d='M7.355 0C6.49 0 5.712.315 5.132.783c-.58.47-.989 1.072-1.297 1.717C3.219 3.79 3 5.262 3 6.4c0 1.604.878 3.88 2.05 5.816.039 1.36.412 2.525 1.09 3.384.71.9 1.78 1.46 2.939 1.467h.018c.675.008 1.354-.177 1.85-.609.5-.434.76-1.085.763-1.783v-.009c.005-.698-.267-1.221-.472-1.8-.207-.58-.4-1.234-.4-2.2 0-.8.581-2.595.581-4.266 0-1.301-.148-2.77-.698-4.025-.275-.627-.655-1.215-1.216-1.658C8.944.273 8.188 0 7.355 0zm9.29 6.933c-.833 0-1.589.273-2.15.717-.561.444-.941 1.031-1.216 1.658-.55 1.254-.698 2.724-.698 4.025 0 1.671.58 3.467.58 4.267 0 .965-.192 1.62-.399 2.2-.205.578-.477 1.1-.472 1.8v.008c.003.698.263 1.35.762 1.784.497.432 1.177.616 1.851.608h.018c1.158-.006 2.229-.567 2.94-1.467.677-.858 1.05-2.023 1.089-3.383 1.172-1.937 2.05-4.213 2.05-5.817 0-1.137-.219-2.61-.835-3.9-.308-.644-.718-1.248-1.297-1.716a3.544 3.544 0 00-2.223-.784z'
      />
    </g>
    <defs
      key='key-1'
    >
      <clipPath
        id='s-af0a7d7500-a'
      >
        <path
          d='M0 0h24v24H0z'
        />
      </clipPath>
    </defs>
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
  displayName: 'IconTour'
})
