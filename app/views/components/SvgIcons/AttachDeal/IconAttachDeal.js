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
      d='M19 7.413a.993.993 0 0 1-1 .986h-7c-.552 0-1-.442-1-.986a.993.993 0 0 1 1-.987h7c.552 0 1 .442 1 .987zm-7.5 3.452h4c.552 0 1 .442 1 .987a.993.993 0 0 1-1 .987h-4c-.552 0-1-.442-1-.987a.993.993 0 0 1 1-.987zM24 5.355l.003 13.895c0 1.09-.895 1.973-2 1.973H9.839a.3.3 0 0 1-.28-.407l.351-.922a1 1 0 0 1 .935-.643H21.5c.276 0 .5-.22.5-.493v-13.2a.49.49 0 0 0-.147-.347l-2.121-2.093a.503.503 0 0 0-.354-.145H8.5c-.276 0-.5.22-.5.493v1.522a.3.3 0 0 1-.416.276l-1.421-.598A.243.243 0 0 1 6 4.44V2.973C6 1.883 6.895 1 8 1h11.585c.53 0 1.039.208 1.414.578l2.415 2.382c.375.37.586.872.586 1.396zM4.841 6.934a4.589 4.589 0 0 1 2.81 1.231 4.151 4.151 0 0 1 1.315 3.013v8.664C8.959 21.589 7.464 23 5.627 23c-1.839 0-3.333-1.41-3.342-3.16v-7.031c-.03-.768.383-1.49 1.077-1.88a2.297 2.297 0 0 1 2.244 0c.694.391 1.107 1.113 1.075 1.874l.003 4.33c0 .265-.149.51-.388.64a.804.804 0 0 1-.769.001.733.733 0 0 1-.389-.64l.001-4.33c-.008-.332-.298-.6-.655-.6-.358 0-.647.268-.655.598v7.038c0 .937.803 1.698 1.797 1.698.994 0 1.797-.761 1.797-1.698v-8.663c0-1.534-1.315-2.781-2.939-2.781s-2.938 1.247-2.938 2.781v6.495a.732.732 0 0 1-.385.65.803.803 0 0 1-.775 0A.731.731 0 0 1 0 17.675v-6.497a4.15 4.15 0 0 1 1.315-3.013 4.605 4.605 0 0 1 3.169-1.245h.372l-.015.014z'
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
  displayName: 'IconAttachDeal'
})
