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
      fill="noe"
      d="M1.923 13.807c-.598-.353-.95-.98-.921-1.642.028-.663.433-1.261 1.06-1.568l19.383-9.493a1.175 1.175 0 0 1 1.194.136l.008.006c.283.25.409.622.33.985l-4.687 18.35a1.893 1.893 0 0 1-1.175 1.282 2.088 2.088 0 0 1-1.796-.147l-3.47-2.049-1.933 1.815a1.6 1.6 0 0 1-1.659.31c-.569-.222-.94-.742-.94-1.32v-3.48l-5.394-3.185zm1.508-1.62a.074.074 0 0 0-.043.064.073.073 0 0 0 .037.066l4.702 2.777c.034.02.078.014.104-.014l8.81-9.392a.071.071 0 0 0 .002-.094.083.083 0 0 0-.096-.022L3.43 12.188zm16.39-6.205a.073.073 0 0 0-.04-.084.083.083 0 0 0-.096.018l-9.602 10.233a.069.069 0 0 0-.019.059c.003.022.017.04.036.052l6.085 3.592a.085.085 0 0 0 .073.006.077.077 0 0 0 .048-.051l3.516-13.825zM9.157 19.75v-2.01l1.31.776-1.31 1.233zm.832-1.183l-.53-.314v.813l.53-.499z"
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
  displayName: 'IconMarketingInsights'
})
