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
      fill='#0945eb'
      fillRule='evenodd'
      d='M12 15.652a3.652 3.652 0 1 1 0-7.304 3.652 3.652 0 0 1 0 7.304zM2.622 9.688a1.955 1.955 0 0 0 1.11-2.681l-.6-1.266A1.955 1.955 0 0 1 5.74 3.132l1.265.602a1.957 1.957 0 0 0 2.681-1.11l.47-1.322a1.957 1.957 0 0 1 3.688 0l.47 1.321a1.957 1.957 0 0 0 2.682 1.11l1.266-.6A1.955 1.955 0 0 1 20.87 5.74l-.6 1.264a1.955 1.955 0 0 0 1.11 2.682l1.32.47a1.957 1.957 0 0 1 0 3.688l-1.32.47a1.955 1.955 0 0 0-1.11 2.682l.6 1.266a1.957 1.957 0 0 1-2.608 2.608l-1.264-.602a1.955 1.955 0 0 0-2.683 1.112l-.47 1.32a1.958 1.958 0 0 1-3.687 0l-.47-1.32a1.955 1.955 0 0 0-2.682-1.112l-1.266.602a1.957 1.957 0 0 1-2.609-2.608l.602-1.265a1.955 1.955 0 0 0-1.11-2.683l-1.32-.47a1.957 1.957 0 0 1 0-3.687l1.32-.47zm9.379-4.469a6.783 6.783 0 1 0 0 13.565A6.783 6.783 0 0 0 12 5.22z'
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
  displayName: 'IconCogActive'
})
