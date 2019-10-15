import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '136'
const height = '88'
const viewBox = '0 0 136 88'

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
      fill='none'
      fillRule='evenodd'
      key='key-0'
    >
      <path
        fill='#FEC008'
        fillRule='nonzero'
        d='M0 0h136v88H0z'
      />
      <g
        fill='#000'
      >
        <path
          fillRule='nonzero'
          d='M39 70h58v2H39zM61 38h14v12h6L68 65 55 50h6z'
        />
        <path
          d='M52.96 26.16c-1 0-1.873-.16-2.62-.48-.747-.32-1.323-.773-1.73-1.36-.407-.587-.61-1.273-.61-2.06v-.48c0-.093.027-.167.08-.22a.297.297 0 0 1 .22-.08h1.28c.093 0 .167.027.22.08.053.053.08.127.08.22v.38c0 .68.293 1.24.88 1.68.587.44 1.367.66 2.34.66.92 0 1.613-.193 2.08-.58.467-.387.7-.893.7-1.52 0-.413-.12-.767-.36-1.06-.24-.293-.59-.563-1.05-.81-.46-.247-1.13-.543-2.01-.89-.973-.373-1.743-.713-2.31-1.02a4.272 4.272 0 0 1-1.41-1.21c-.373-.5-.56-1.13-.56-1.89 0-1.147.41-2.047 1.23-2.7.82-.653 1.93-.98 3.33-.98.987 0 1.853.167 2.6.5.747.333 1.323.8 1.73 1.4.407.6.61 1.293.61 2.08v.3a.297.297 0 0 1-.08.22.297.297 0 0 1-.22.08h-1.3a.323.323 0 0 1-.22-.07.24.24 0 0 1-.08-.19v-.24c0-.693-.277-1.27-.83-1.73-.553-.46-1.317-.69-2.29-.69-.827 0-1.467.17-1.92.51-.453.34-.68.83-.68 1.47 0 .44.113.8.34 1.08.227.28.563.53 1.01.75.447.22 1.13.503 2.05.85.947.373 1.713.717 2.3 1.03a4.391 4.391 0 0 1 1.46 1.24c.387.513.58 1.15.58 1.91s-.193 1.427-.58 2c-.387.573-.947 1.02-1.68 1.34-.733.32-1.593.48-2.58.48zm9.32-11.86c-.387 0-.703-.117-.95-.35-.247-.233-.37-.537-.37-.91s.123-.677.37-.91c.247-.233.563-.35.95-.35s.7.117.94.35c.24.233.36.537.36.91s-.12.677-.36.91c-.24.233-.553.35-.94.35zM61.62 26a.297.297 0 0 1-.22-.08.297.297 0 0 1-.08-.22v-9.58c0-.093.027-.167.08-.22a.297.297 0 0 1 .22-.08h1.32c.093 0 .167.027.22.08.053.053.08.127.08.22v9.58a.297.297 0 0 1-.08.22.297.297 0 0 1-.22.08h-1.32zm11.82-9.88c0-.093.027-.167.08-.22a.297.297 0 0 1 .22-.08h1.32c.093 0 .167.027.22.08.053.053.08.127.08.22v9.36c0 1.6-.457 2.75-1.37 3.45-.913.7-2.13 1.05-3.65 1.05a14.9 14.9 0 0 1-.92-.04c-.187 0-.28-.107-.28-.32l.04-1.18c0-.093.033-.167.1-.22a.3.3 0 0 1 .24-.06c.187.013.447.02.78.02 1.107 0 1.907-.21 2.4-.63.493-.42.74-1.13.74-2.13v-.34c0-.04-.013-.063-.04-.07-.027-.007-.053.003-.08.03-.573.64-1.387.96-2.44.96a4.23 4.23 0 0 1-2.35-.68c-.7-.453-1.183-1.12-1.45-2-.173-.587-.26-1.4-.26-2.44 0-1.107.1-1.96.3-2.56.253-.8.703-1.443 1.35-1.93.647-.487 1.41-.73 2.29-.73 1.093 0 1.947.327 2.56.98.027.04.053.053.08.04.027-.013.04-.04.04-.08v-.48zm-.12 6.62c.04-.213.07-.44.09-.68.02-.24.03-.64.03-1.2 0-.56-.01-.957-.03-1.19a4.258 4.258 0 0 0-.11-.67 2.117 2.117 0 0 0-.72-1.21c-.373-.313-.84-.47-1.4-.47-.56 0-1.027.157-1.4.47-.373.313-.64.717-.8 1.21-.147.4-.22 1.02-.22 1.86 0 .92.067 1.547.2 1.88.133.493.397.897.79 1.21.393.313.87.47 1.43.47.587 0 1.063-.157 1.43-.47a2.14 2.14 0 0 0 .71-1.21zm10.26-7.06c1.093 0 1.96.317 2.6.95.64.633.96 1.49.96 2.57v6.5a.297.297 0 0 1-.08.22.297.297 0 0 1-.22.08h-1.32a.297.297 0 0 1-.22-.08.297.297 0 0 1-.08-.22v-6.12c0-.667-.193-1.207-.58-1.62-.387-.413-.9-.62-1.54-.62-.573 0-1.057.17-1.45.51-.393.34-.623.797-.69 1.37v6.48a.297.297 0 0 1-.08.22.297.297 0 0 1-.22.08h-1.32a.297.297 0 0 1-.22-.08.297.297 0 0 1-.08-.22v-9.58c0-.093.027-.167.08-.22a.297.297 0 0 1 .22-.08h1.32c.093 0 .167.027.22.08.053.053.08.127.08.22v.56c0 .04.013.067.04.08.027.013.047.007.06-.02.56-.707 1.4-1.06 2.52-1.06z'
        />
      </g>
    </g>
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
  displayName: 'Sign'
})
