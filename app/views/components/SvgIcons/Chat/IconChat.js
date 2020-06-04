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
      d='M3.129 23a1.49 1.49 0 0 1-1.348-.803c-.315-.582-.246-1.243.184-1.771.193-.236.418-.506.669-.764a6.065 6.065 0 0 0 1.342-2.115 14.294 14.294 0 0 1-.68-.491c-1.265-.984-2.146-2.074-2.69-3.332-.482-1.113-.677-2.24-.583-3.349.094-1.082.463-2.155 1.103-3.188C2.303 5.282 4.05 3.92 6.469 3.025c3.527-1.308 7.112-1.364 10.656-.168 2.334.788 4.1 2.017 5.4 3.755 1.025 1.374 1.533 2.963 1.47 4.595-.064 1.631-.694 3.175-1.819 4.476-1.604 1.852-3.75 3.078-6.556 3.746-1.582.377-3.248.49-5.087.345-1.835 1.534-4.005 2.574-6.45 3.094a7.68 7.68 0 0 1-.578.094l-.11.016v.001c-.089.013-.178.02-.266.02zm8.9-19.046c-1.636 0-3.27.3-4.892.902-1.996.74-3.424 1.84-4.366 3.362-.964 1.558-1.09 3.102-.388 4.724.41.95 1.097 1.788 2.096 2.565.247.192.51.372.79.563.13.088.265.18.399.274l.549.387-.165.655h.002a8.02 8.02 0 0 1-1.85 3.447c1.948-.491 3.682-1.37 5.155-2.622.127-.107.582-.451 1.15-.401 1.704.15 3.228.057 4.66-.283 2.4-.572 4.214-1.595 5.543-3.13 1.696-1.959 1.798-4.554.261-6.613-1.052-1.41-2.515-2.418-4.465-3.075a13.962 13.962 0 0 0-4.479-.755z'
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
  displayName: 'IconChat'
})
