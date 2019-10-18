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
      d='M7.355 0a3.55 3.55 0 00-2.223.783c-.58.47-.989 1.072-1.297 1.717C3.219 3.79 3 5.262 3 6.4c0 1.604.878 3.88 2.05 5.816.039 1.36.412 2.525 1.09 3.384.71.9 1.78 1.46 2.939 1.467h.018c.675.008 1.354-.177 1.85-.609.5-.434.76-1.085.763-1.783v-.009c.005-.698-.267-1.221-.472-1.8-.207-.58-.4-1.234-.4-2.2 0-.8.581-2.595.581-4.266 0-1.301-.148-2.77-.698-4.025-.275-.627-.655-1.215-1.216-1.658C8.944.273 8.188 0 7.355 0zm0 1.6c.448 0 .738.114 1.016.333.278.22.532.57.735 1.034.406.927.571 2.257.571 3.433 0 1.286-.58 2.933-.58 4.267v.075l-2.704.416C5.431 9.454 4.742 7.331 4.742 6.4c0-.93.214-2.256.69-3.25.236-.497.534-.909.852-1.167a1.576 1.576 0 011.07-.383zm9.29 5.333c-.833 0-1.589.273-2.15.717-.561.444-.941 1.031-1.216 1.658-.55 1.254-.698 2.724-.698 4.025 0 1.671.58 3.467.58 4.267 0 .965-.192 1.62-.399 2.2-.205.578-.477 1.1-.472 1.8v.008c.003.698.263 1.35.762 1.784.497.432 1.177.616 1.851.608h.018c1.158-.006 2.229-.567 2.94-1.467.677-.858 1.05-2.023 1.089-3.383 1.172-1.937 2.05-4.213 2.05-5.817 0-1.137-.219-2.61-.835-3.9-.308-.644-.718-1.248-1.297-1.716a3.544 3.544 0 00-2.223-.784zm0 1.6c.437 0 .752.125 1.07.384.32.258.616.67.854 1.166.475.994.689 2.321.689 3.25 0 .931-.69 3.054-1.651 4.759l-2.704-.417V17.6c0-1.333-.58-2.98-.58-4.267 0-1.176.165-2.506.571-3.433.203-.463.457-.813.735-1.033.278-.22.568-.334 1.016-.334zm-7.358 3.809c.086.384.187.727.29 1.016.232.651.394 1.06.39 1.3v.008c0 .366-.1.523-.217.625-.117.102-.306.182-.635.175h-.018c-.578 0-1.096-.241-1.543-.808-.352-.447-.631-1.1-.734-1.941l2.467-.376zm5.426 6.933l2.467.375c-.103.84-.382 1.494-.734 1.941-.447.567-.966.809-1.543.809h-.018c-.329.006-.518-.073-.635-.175-.117-.103-.218-.26-.218-.625v-.009c-.003-.24.16-.649.39-1.3a8.77 8.77 0 00.29-1.016z'
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
  displayName: 'IconTourOutline'
})
