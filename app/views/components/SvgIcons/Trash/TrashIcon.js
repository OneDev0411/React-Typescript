import React, { Fragment } from 'react'
import PropTypes from 'prop-types'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const sizes = {
  small: { width: 18, height: 18 },
  medium: { width: 24, height: 24 },
  large: { width: 36, height: 36 }
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
      d='M8.157 1.716A2.367 2.367 0 0 1 9.848 1h4.304c.634 0 1.242.258 1.691.716.448.458.7 1.08.7 1.728v.489h5.5c.529 0 .957.438.957.978s-.428.978-.956.978h-1.468c-.049.711-.155 2.026-.351 4.355-.229 2.727-.439 5.25-.468 5.607a559.323 559.323 0 0 1-.438 5.151 2.346 2.346 0 0 1-.681 1.335 2.457 2.457 0 0 1-.916.569l-.209.08-5.4.01c-5.154.009-5.607.023-5.979-.145-.064-.029-.125-.063-.207-.103a2.31 2.31 0 0 1-1.146-1.331c-.091-.271-.137-.704-.348-3.295-.043-.533-.059-.719-.36-4.324a2809.213 2809.213 0 0 0-.419-4.99 778.43 778.43 0 0 0-.162-1.926c-.035-.418-.062-.74-.079-.993H1.957c-.529 0-.957-.438-.957-.978s.428-.978.957-.978h5.5v-.489c0-.648.251-1.27.7-1.728zm6.473 1.728v.489H9.37v-.489c0-.13.05-.254.14-.346a.471.471 0 0 1 .338-.143h4.304c.127 0 .248.052.338.143.09.092.14.217.14.346zm-3.826 6.6a.967.967 0 0 0-.956-.978.968.968 0 0 0-.957.978v7.333c0 .54.428.978.957.978a.967.967 0 0 0 .956-.978v-7.333zm3.348-.977c.528 0 .957.438.957.978v7.333c0 .54-.428.978-.957.978a.968.968 0 0 1-.957-.978v-7.333a.968.968 0 0 1 .957-.978zm4.247.622c.108-1.336.255-3.083.273-3.234l.02-.171H5.301l.017.081c.009.045.027.219.039.387s.046.574.075.901c.053.596.879 10.489.975 11.675.13 1.615.14 1.66.39 1.778.117.055.537.06 5.205.06 4.763 0 5.086-.004 5.202-.063.04-.02.073-.032.101-.05.171-.11.189-.46.499-4.262.031-.375.079-.951.108-1.279s.085-1.003.125-1.498c.04-.495.13-1.566.199-2.378l.163-1.947z'
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
  displayName: 'TrashIcon'
})
