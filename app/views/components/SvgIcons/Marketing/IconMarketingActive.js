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
      fill='none'
      fillRule='evenodd'
      key='key-0'
    >
      <path
        fill='#FFF'
        d='M-56-323H50v514H-56z'
      />
      <path
        fill='#003BDF'
        fillRule='nonzero'
        d='M15.592 21.204h3.816a.449.449 0 0 0 .45-.449v-8.082a.898.898 0 1 1 1.795 0v8.082A2.245 2.245 0 0 1 19.408 23H4.592a2.245 2.245 0 0 1-2.245-2.245v-8.082a.898.898 0 1 1 1.796 0v3.143h9.653v-3.143a.898.898 0 1 1 1.796 0v8.531zm-1.796 0v-3.592H4.143v3.143c0 .248.2.45.449.45h9.204zM7.959 10.878c-.784 0-1.496-.31-2.02-.813A2.918 2.918 0 0 1 1 7.96l.021-.195 1.23-5.535a1.57 1.57 0 0 1 1.534-1.229h16.429a1.57 1.57 0 0 1 1.534 1.23l1.23 5.534.022.195a2.918 2.918 0 0 1-4.939 2.106 2.909 2.909 0 0 1-2.02.813c-.784 0-1.496-.31-2.02-.813a2.909 2.909 0 0 1-2.021.813c-.784 0-1.496-.31-2.02-.813a2.909 2.909 0 0 1-2.02.813z'
      />
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
  displayName: 'IconMarketingActive'
})
