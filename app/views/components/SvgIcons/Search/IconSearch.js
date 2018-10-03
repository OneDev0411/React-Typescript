import React from 'react'
import styled, { css } from 'styled-components'

const width = '16'
const height = '16'
const viewBox = '0 0 16 16'

const getDimensions = () => ({
  height,
  width
})

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({noStyles}) => !noStyles ? getDimensionsCss() : null}
`

const defaultProps = {
  children: [
    <path
      d='M6.669.19C3.105.19.189 3.1.189 6.663c0 3.563 2.917 6.48 6.48 6.48 1.37 0 2.639-.44 3.685-1.168l3.503 3.496a1.136 1.136 0 0 0 1.62 0 1.14 1.14 0 0 0 0-1.613l-3.504-3.503a6.416 6.416 0 0 0 1.168-3.692C13.14 3.099 10.225.19 6.668.19h.001zm0 2.282a4.173 4.173 0 0 1 4.185 4.191 4.173 4.173 0 0 1-4.185 4.191 4.174 4.174 0 0 1-4.191-4.191 4.174 4.174 0 0 1 4.191-4.191z'
      key='key-0'
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconSearch'
})
