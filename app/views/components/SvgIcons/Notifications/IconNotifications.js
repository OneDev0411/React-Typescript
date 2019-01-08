import React from 'react'
import styled, { css } from 'styled-components'

const width = '12'
const height = '12'
const viewBox = '0 0 12 12'

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
      d="M8.148 10C8.089 11.114 7.15 12 6 12c-1.15 0-2.09-.886-2.148-2H1.474C.66 10 0 9.354 0 8.556c0-.76.599-1.384 1.358-1.44v-2.56C1.358 2.038 3.436 0 6 0c2.564 0 4.642 2.04 4.642 4.555v2.56c.758.057 1.358.68 1.358 1.44C12 9.354 11.34 10 10.526 10H8.148zm-1.135 0H4.987c.057.5.489.889 1.013.889.524 0 .956-.389 1.013-.889zm3.515-1.778a1.009 1.009 0 0 1-1.019-1V4.555C9.51 2.653 7.94 1.111 6 1.111c-1.939 0-3.51 1.542-3.51 3.444v2.667c0 .552-.456 1-1.018 1-.187 0-.34.15-.34.334 0 .183.153.333.342.333h9.052c.189 0 .342-.15.342-.333a.338.338 0 0 0-.34-.334z"
      fillRule="nonzero"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconNotifications'
})
