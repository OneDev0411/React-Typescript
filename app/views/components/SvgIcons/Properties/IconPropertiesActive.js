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
      fill='#00B286'
      key='key-0'
    >
      <path
        d='M22.136 5.238A2.491 2.491 0 0 0 19.649 3h-1.073a.242.242 0 0 0-.109.025.255.255 0 0 0-.134.283c.11.472.166.956.167 1.442a.245.245 0 0 0 .073.177.245.245 0 0 0 .177.073h.9a.5.5 0 0 1 .5.447l.315 3a.5.5 0 0 1-.5.551h-2.74a.248.248 0 0 0-.215.122 23.448 23.448 0 0 1-2.352 3.2.249.249 0 0 0-.06.179l.181 2.97a.491.491 0 0 1-.135.374.493.493 0 0 1-.365.157H9.72a.506.506 0 0 1-.365-.157.5.5 0 0 1-.135-.374L9.4 12.5a.25.25 0 0 0-.061-.179 23.448 23.448 0 0 1-2.352-3.2A.248.248 0 0 0 6.775 9h-2.74a.51.51 0 0 1-.373-.164.51.51 0 0 1-.127-.388l.316-3A.502.502 0 0 1 4.35 5h.9a.25.25 0 0 0 .25-.25c.001-.486.057-.97.168-1.443.008-.037.008-.075 0-.112s-.025-.071-.048-.1a.259.259 0 0 0-.087-.07A.256.256 0 0 0 5.424 3H4.35a2.5 2.5 0 0 0-2.486 2.238l-1.684 16A2.499 2.499 0 0 0 2.666 24h18.668a2.51 2.51 0 0 0 1.858-.827 2.51 2.51 0 0 0 .52-.901c.108-.333.145-.685.108-1.034l-1.684-16zM6.848 21.531a.5.5 0 0 1-.5.469H2.666a.51.51 0 0 1-.373-.164.506.506 0 0 1-.105-.181c-.022-.067-.029-.138-.022-.208l.316-3a.501.501 0 0 1 .5-.448h3.55a.506.506 0 0 1 .365.157.5.5 0 0 1 .135.374l-.184 3.001zm.366-6a.5.5 0 0 1-.5.469H3.3a.51.51 0 0 1-.373-.164.502.502 0 0 1-.127-.388l.421-4a.496.496 0 0 1 .164-.32.496.496 0 0 1 .336-.128h3.24a.506.506 0 0 1 .365.157.5.5 0 0 1 .135.374l-.247 4zm7.8 6.312a.493.493 0 0 1-.364.157H9.354a.506.506 0 0 1-.365-.157.5.5 0 0 1-.135-.374l.183-3a.5.5 0 0 1 .5-.469h4.926a.502.502 0 0 1 .5.469l.183 3a.509.509 0 0 1-.136.374h.004zm1.776-6.312l-.244-4a.509.509 0 0 1 .135-.374.503.503 0 0 1 .365-.157h3.24a.503.503 0 0 1 .5.448l.421 4a.5.5 0 0 1-.5.552h-3.422a.5.5 0 0 1-.499-.469h.004zm4.921 6.3a.498.498 0 0 1-.373.166h-3.687a.502.502 0 0 1-.5-.469l-.183-3a.509.509 0 0 1 .135-.374.493.493 0 0 1 .365-.157h3.55a.503.503 0 0 1 .5.448l.316 3a.506.506 0 0 1-.127.389l.004-.003z'
      />
      <path
        d='M12 13a.497.497 0 0 0 .354-.146C12.543 12.664 17 8.171 17 5A5.001 5.001 0 0 0 7 5c0 3.171 4.457 7.664 4.647 7.854A.499.499 0 0 0 12 13zm-1.75-8a1.752 1.752 0 0 1 2.091-1.717 1.754 1.754 0 0 1 1.375 1.375A1.75 1.75 0 1 1 10.25 5z'
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
  displayName: 'IconPropertiesActive'
})
