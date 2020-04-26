import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const sizes = {
  small: { width: 16, height: 16 },
  medium: { width: 24, height: 24 },
  large: { width: 32, height: 32 }
}

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
      fill='currentColor'
      clipPath='url(#s-0655e57c09-a)'
      key='key-0'
    >
      <path
        d='M20.821 10.737a10.586 10.586 0 0 0-6.584-2.722.25.25 0 0 1-.237-.249v-2.2a.988.988 0 0 0-1.63-.75l-6.932 5.926a1 1 0 0 0 0 1.52l6.952 5.946a.975.975 0 0 0 1.61-.742v-2.419a.249.249 0 0 1 .186-.241c1.473-.392 5.847-.954 8.866 4.925A.5.5 0 0 0 24 19.5c0-3.809-1.07-6.757-3.179-8.763z'
      />
      <path
        d='M2.289 11.5l6.96-5.73a1 1 0 0 0-1.271-1.544L.549 10.344a1.5 1.5 0 0 0 0 2.316L7.8 18.633a1 1 0 0 0 1.271-1.544L2.289 11.5z'
      />
    </g>
    <defs
      key='key-1'
    >
      <clipPath
        id='s-0655e57c09-a'
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
  displayName: 'IconReplyAll'
})
