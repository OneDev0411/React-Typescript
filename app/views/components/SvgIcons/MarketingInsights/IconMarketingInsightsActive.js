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
      fill="#0945eb"
      d="M1.923 13.807c-.598-.353-.95-.98-.921-1.642.028-.663.433-1.261 1.06-1.568l19.383-9.493a1.175 1.175 0 0 1 1.194.136l.008.006c.283.25.409.622.33.985l-4.687 18.35a1.893 1.893 0 0 1-1.175 1.282 2.088 2.088 0 0 1-1.796-.147l-3.47-2.049-1.933 1.815a1.6 1.6 0 0 1-1.659.31c-.569-.222-.94-.742-.94-1.32v-3.48l-5.394-3.185zm16.13-7.833L8.964 13.73a1 1 0 0 0 .085 1.587l1.131.772a1 1 0 0 0 1.37-.235l6.94-9.473a.3.3 0 0 0-.437-.406z"
      key="key-0"
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
  displayName: 'IconMarketingInsightsActive'
})
