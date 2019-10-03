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
      clipPath='url(#s-baf01ce982-a)'
      key='key-0'
    >
      <path
        fill='currentColor'
        d='M19.035 7.569c-3.466-2.039-8.23-1.757-13.182.754a.251.251 0 0 1-.29-.046L2.557 5.283A1.5 1.5 0 0 0 0 6.348v11.8a1 1 0 0 0 1 1h11.792a1.5 1.5 0 0 0 1.061-2.561l-2.5-2.5a.25.25 0 0 1 .062-.399c2.847-1.457 5.857-1.7 7.972-.565C21.1 14.034 22 15.773 22 18.146a1 1 0 0 0 2 0c0-4.935-1.763-8.692-4.965-10.577z'
      />
    </g>
    <defs
      key='key-1'
    >
      <clipPath
        id='s-baf01ce982-a'
      >
        <path
          fill='transparent'
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
  displayName: 'IconReply'
})
