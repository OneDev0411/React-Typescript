import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 264.6 257.3'

const sizes = {}

// somehow sizes is ending up in markup, even if it is not a valid svg attribute
// until we have a better solution, just render it empty, instead to '[Object object]'
Object.defineProperty(sizes, 'toString', { value: () => '', enumerable: false })

const getDimensions = (size, sizes) => {
  if (
    size &&
    typeof size.width === 'number' &&
    typeof size.height === 'number'
  ) {
    return size
  }
  return size && sizes[size] ? sizes[size] : { width, height }
}

const getCss = (size, sizes, fillColor, fillColorRule, noStyles) => {
  if (noStyles) {
    return ''
  }
  const dimensions = getDimensions(size, sizes)
  const fillRule =
    fillColor && fillColorRule ? `${fillColorRule}{ fill: ${fillColor}; }` : ''
  return css`
    width: ${dimensions.width}px;
    height: ${dimensions.height}px;
    ${fillRule}
  `
}

const propsToCss = ({ size, sizes, fillColor, fillColorRule, noStyles }) =>
  getCss(size, sizes, fillColor, fillColorRule, noStyles)

const Image = styled.svg`
  ${propsToCss}
`

const children = (
  <Fragment>
    <path
      d="M228.9-93.4 96.7-229-35.6-93.3H4.7V28.3h183.9V-93.4h40.3z"
      style="fill:#d92228;stroke-width:7.61610126"
      transform="translate(35.6 229)"
    />
    <path
      d="M147.1-128.9a22 22 0 0 0-15.7-5.3c-11 0-18 4.6-22.9 8.5a57.3 57.3 0 0 0-14.9 23.2l.3-12.4.2-13.4c0-1.5-1-3-3.3-3h-43v3.6l1.2.1c3.5.3 6.8.6 9.9 2.8a11 11 0 0 1 4.8 7.6c.9 3.7.9 14.7.9 19.4v62.2c0 6.4-.2 15-1.2 20.9C61.7-9 60-7.3 56.1-5.4a25.9 25.9 0 0 1-7.7 2l-1.2.1V.4h64.2v-3.7h-1.1c-2.6-.3-4.6-.7-7.2-1.8-1.9-.7-3.6-2.5-5.3-5.7A57 57 0 0 1 93.7-37v-26c0-7.9.4-15.4.6-18.7 2.9-20.8 14.2-37.4 21.5-37.4 2.8 0 4.5 3 6.6 8 2.3 5.5 5.6 11.5 15.2 11.5 9.4 0 14.3-8 14.3-15.9.1-5.3-1.5-9.7-4.8-13.4z"
      style="fill:#fff;stroke-width:7.61610126"
      transform="translate(35.6 229)"
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
  displayName: 'IconZillow'
})
