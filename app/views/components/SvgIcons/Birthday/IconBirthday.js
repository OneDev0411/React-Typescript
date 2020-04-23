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
    <path
      d='M22 10.557c0-1.856-1.492-3.36-3.333-3.36h-3.89c1.123-.425 2.324-.985 2.968-1.635.894-.9 1.428-2.063 1.426-3.111 0-.716-.237-1.334-.69-1.789-1.108-1.122-3.358-.776-4.86.742-.644.65-1.2 1.86-1.621 2.993-.42-1.133-.977-2.344-1.621-2.993C8.875-.116 6.627-.462 5.519.662c-.453.455-.69 1.073-.69 1.789-.002 1.048.532 2.212 1.426 3.111.644.65 1.845 1.21 2.969 1.634h-3.89C3.492 7.196 2 8.701 2 10.557v3.36h1.667v6.722C3.667 22.495 5.159 24 7 24h10c1.84 0 3.333-1.504 3.333-3.36v-6.722H22v-3.36zm-7.2-7.965c.577-.584 1.308-.945 1.905-.945.181 0 .43.034.598.204.167.169.201.42.201.602.002.602-.358 1.339-.937 1.921-.552.557-2.026 1.159-3.345 1.59.427-1.329 1.026-2.816 1.577-3.372zm-8.305-.14c0-.181.034-.433.202-.601.168-.17.417-.204.597-.204.598 0 1.328.361 1.906.945.552.556 1.15 2.043 1.578 3.372-1.319-.43-2.794-1.034-3.345-1.59-.58-.582-.94-1.32-.938-1.921zm-2.828 8.105c0-.926.747-1.68 1.666-1.68h5.834v3.36h-7.5v-1.68zM5.333 20.64v-6.721h5.834v8.402H7a1.676 1.676 0 0 1-1.667-1.68zm13.334 0c0 .927-.748 1.68-1.667 1.68h-4.167v-8.401h5.834v6.721zm1.666-8.401h-7.5V8.877h5.834c.919 0 1.666.754 1.666 1.68v1.68z'
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
  noStyles: PropTypes.bool,
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
  displayName: 'IconBirthday'
})
