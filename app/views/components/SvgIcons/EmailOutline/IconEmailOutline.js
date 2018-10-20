import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
`

const defaultProps = {
  children: [
    <path
      d="M4.727 7.183A.741.741 0 0 0 4 7.917v9.166c0 .397.334.734.727.734h14.546a.741.741 0 0 0 .727-.734V7.917a.741.741 0 0 0-.727-.734H4.727zm.364 1.1h13.818v.27L12 13.646 5.091 8.553v-.27zm0 1.633l3.602 2.658-3.602 3.404V9.916zm13.818 0v6.062l-3.602-3.404 3.602-2.658zm-9.318 3.317l2.085 1.541a.542.542 0 0 0 .648 0l2.085-1.54 3.688 3.483H5.903l3.688-3.484z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconEmailOutline'
})
