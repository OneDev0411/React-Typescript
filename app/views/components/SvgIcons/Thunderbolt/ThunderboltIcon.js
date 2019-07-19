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
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)}
`

const defaultProps = {
  children: [
    <path
      d="M20.94 9.272a.534.534 0 0 0-.47-.27h-7.808L14.635.61a.493.493 0 0 0-.3-.566.548.548 0 0 0-.647.166L3.1 14.208a.477.477 0 0 0-.043.522.534.534 0 0 0 .474.272h7.809L9.367 23.39c-.055.232.07.47.3.566a.548.548 0 0 0 .648-.166L20.902 9.792a.477.477 0 0 0 .039-.52z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'ThunderboltIcon'
})
