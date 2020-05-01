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
      fillRule='evenodd'
      d='M12 .747c-.797 0-1.091.113-1.594.331a4 4 0 0 0-1.294.901L.847 9.242A.993.993 0 0 0 .5 10v11.25a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5V10a.983.983 0 0 0 0 .008m-2.56-.047l-7.407-6.51a1.016 1.016 0 0 1-.071-.069 2 2 0 0 0-2.924 0 .994.994 0 0 1-.07.07L3.06 9.96l5.733 4.548.038.03 1.934 1.534h.001a2 2 0 0 0 2.468 0h.001l1.936-1.536a.926.926 0 0 1 .033-.026l5.736-4.55zm-5.209 6.684l2.312 2.312a1 1 0 0 0 1.414-1.414l-2.148-2.149L21.5 12.07v9.18a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-9.18l4.191 3.324-2.148 2.149a1 1 0 1 0 1.414 1.414l2.312-2.312 1.257.997.003.003a4 4 0 0 0 4.942 0l1.26-1z'
      clipRule='evenodd'
      key='key-0'
    />
    <path
      fillRule='evenodd'
      d='M12 .747c-.797 0-1.091.113-1.594.331a4 4 0 0 0-1.294.901L.847 9.242A.993.993 0 0 0 .5 10v11.25a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5V10.008l-9.488-8.254c-.518-.45-1.062-.928-1.745-.994A2.767 2.767 0 0 0 12 .747zm1.533 2.704l7.407 6.51-5.736 4.55a.926.926 0 0 0-.033.026l-1.936 1.536h-.001a2 2 0 0 1-2.468 0h-.001L8.83 14.539a1.006 1.006 0 0 0-.038-.03L3.06 9.96l7.407-6.51a.994.994 0 0 0 .071-.069 2 2 0 0 1 2.924 0l.07.07zm2.198 13.194l2.312 2.312a1 1 0 0 0 1.414-1.414l-2.148-2.149L21.5 12.07v9.18a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-9.18l4.191 3.324-2.148 2.149a1 1 0 1 0 1.414 1.414l2.312-2.312 1.257.997.003.003a4 4 0 0 0 4.942 0l1.26-1z'
      clipRule='evenodd'
      key='key-1'
    />
    <path
      fillRule='evenodd'
      d='M12 .747c-.797 0-1.091.113-1.594.331a4 4 0 0 0-1.294.901L.847 9.242A.993.993 0 0 0 .5 10v11.25a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5V10.008l-9.488-8.254c-.518-.45-1.062-.928-1.745-.994A2.767 2.767 0 0 0 12 .747zm1.533 2.704l7.407 6.51-5.736 4.55a.926.926 0 0 0-.033.026l-1.936 1.536h-.001a2 2 0 0 1-2.468 0h-.001L8.83 14.539a1.006 1.006 0 0 0-.038-.03L3.06 9.96l7.407-6.51a.994.994 0 0 0 .071-.069 2 2 0 0 1 2.924 0l.07.07zm2.198 13.194l2.312 2.312a1 1 0 0 0 1.414-1.414l-2.148-2.149L21.5 12.07v9.18a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-9.18l4.191 3.324-2.148 2.149a1 1 0 1 0 1.414 1.414l2.312-2.312 1.257.997.003.003a4 4 0 0 0 4.942 0l1.26-1z'
      clipRule='evenodd'
      key='key-2'
    />
    <path
      fillRule='evenodd'
      d='M12 .747c-.797 0-1.091.113-1.594.331a4 4 0 0 0-1.294.901L.847 9.242A.993.993 0 0 0 .5 10v11.25a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5V10.008l-9.488-8.254c-.518-.45-1.062-.928-1.745-.994A2.767 2.767 0 0 0 12 .747zm1.533 2.704l7.407 6.51-5.736 4.55a.926.926 0 0 0-.033.026l-1.936 1.536h-.001a2 2 0 0 1-2.468 0h-.001L8.83 14.539a1.006 1.006 0 0 0-.038-.03L3.06 9.96l7.407-6.51a.994.994 0 0 0 .071-.069 2 2 0 0 1 2.924 0l.07.07zm2.198 13.194l2.312 2.312a1 1 0 0 0 1.414-1.414l-2.148-2.149L21.5 12.07v9.18a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-9.18l4.191 3.324-2.148 2.149a1 1 0 1 0 1.414 1.414l2.312-2.312 1.257.997.003.003a4 4 0 0 0 4.942 0l1.26-1z'
      clipRule='evenodd'
      key='key-3'
    />
    <path
      fillRule='evenodd'
      d='M12 .747c-.797 0-1.091.113-1.594.331a4 4 0 0 0-1.294.901L.847 9.242A.993.993 0 0 0 .5 10v11.25a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5V10.008l-9.488-8.254c-.518-.45-1.062-.928-1.745-.994A2.767 2.767 0 0 0 12 .747zm1.533 2.704l7.407 6.51-5.736 4.55a.926.926 0 0 0-.033.026l-1.936 1.536h-.001a2 2 0 0 1-2.468 0h-.001L8.83 14.539a1.006 1.006 0 0 0-.038-.03L3.06 9.96l7.407-6.51a.994.994 0 0 0 .071-.069 2 2 0 0 1 2.924 0l.07.07zm2.198 13.194l2.312 2.312a1 1 0 0 0 1.414-1.414l-2.148-2.149L21.5 12.07v9.18a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-9.18l4.191 3.324-2.148 2.149a1 1 0 1 0 1.414 1.414l2.312-2.312 1.257.997.003.003a4 4 0 0 0 4.942 0l1.26-1z'
      clipRule='evenodd'
      key='key-4'
    />
    <path
      fillRule='evenodd'
      d='M12 .747c-.797 0-1.091.113-1.594.331a4 4 0 0 0-1.294.901L.847 9.242A.993.993 0 0 0 .5 10v11.25a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5V10.008l-9.488-8.254c-.518-.45-1.062-.928-1.745-.994A2.767 2.767 0 0 0 12 .747zm1.533 2.704l7.407 6.51-5.736 4.55a.926.926 0 0 0-.033.026l-1.936 1.536h-.001a2 2 0 0 1-2.468 0h-.001L8.83 14.539a1.006 1.006 0 0 0-.038-.03L3.06 9.96l7.407-6.51a.994.994 0 0 0 .071-.069 2 2 0 0 1 2.924 0l.07.07zm2.198 13.194l2.312 2.312a1 1 0 0 0 1.414-1.414l-2.148-2.149L21.5 12.07v9.18a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-9.18l4.191 3.324-2.148 2.149a1 1 0 1 0 1.414 1.414l2.312-2.312 1.257.997.003.003a4 4 0 0 0 4.942 0l1.26-1z'
      clipRule='evenodd'
      key='key-5'
    />
    <path
      fillRule='evenodd'
      d='M12 .747c-.797 0-1.091.113-1.594.331a4 4 0 0 0-1.294.901L.847 9.242A.993.993 0 0 0 .5 10v11.25a2.5 2.5 0 0 0 2.5 2.5h18a2.5 2.5 0 0 0 2.5-2.5V10.008l-9.488-8.254c-.518-.45-1.062-.928-1.745-.994A2.767 2.767 0 0 0 12 .747zm1.533 2.704l7.407 6.51-5.736 4.55a.926.926 0 0 0-.033.026l-1.936 1.536h-.001a2 2 0 0 1-2.468 0h-.001L8.83 14.539a1.006 1.006 0 0 0-.038-.03L3.06 9.96l7.407-6.51a.994.994 0 0 0 .071-.069 2 2 0 0 1 2.924 0l.07.07zm2.198 13.194l2.312 2.312a1 1 0 0 0 1.414-1.414l-2.148-2.149L21.5 12.07v9.18a.5.5 0 0 1-.5.5H3a.5.5 0 0 1-.5-.5v-9.18l4.191 3.324-2.148 2.149a1 1 0 1 0 1.414 1.414l2.312-2.312 1.257.997.003.003a4 4 0 0 0 4.942 0l1.26-1z'
      clipRule='evenodd'
      key='key-6'
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
  displayName: 'IconMailRead'
})
