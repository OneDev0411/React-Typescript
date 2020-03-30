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
      clipPath='url(#s-4bc4bbaabb-a)'
      key='key-0'
    >
      <path
        fillRule='evenodd'
        d='M12.28 12.017a.294.294 0 0 1-.16-.047L.3 4.526a.585.585 0 0 1-.264-.597A2.341 2.341 0 0 1 2.342 2h19.317a2.341 2.341 0 0 1 2.285 1.85.586.586 0 0 1-.248.609l-11.258 7.51a.294.294 0 0 1-.159.048zm.024 1.753c.394-.005.78-.124 1.108-.342l9.678-6.452a.586.586 0 0 1 .91.487v12.683a2.342 2.342 0 0 1-2.341 2.342H2.34A2.342 2.342 0 0 1 0 20.146V7.456a.585.585 0 0 1 .898-.496l10.29 6.496c.334.21.721.319 1.116.314z'
        clipRule='evenodd'
      />
    </g>
    <defs
      key='key-1'
    >
      <clipPath
        id='s-4bc4bbaabb-a'
      >
        <path
          fill='#fff'
          d='M0 0h24v24H0V0z'
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
  displayName: 'IconInboxActive'
})
