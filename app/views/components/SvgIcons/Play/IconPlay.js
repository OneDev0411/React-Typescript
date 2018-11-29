import React from 'react'
import styled, { css } from 'styled-components'

const width = '48'
const height = '48'
const viewBox = '0 0 512 512'

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
      d="M432.764 256.003L79.24 499.813V12.194z"
      style={{
        fill: '#000'
      }}
      key="key-0"
    />,
    <path
      d="M79.24 54.227V457.78l292.571-201.777z"
      style={{
        fill: '#000'
      }}
      key="key-1"
    />,
    <path
      d="M79.24 512.003a12.182 12.182 0 0 1-12.19-12.19V12.194A12.189 12.189 0 0 1 86.163 2.158l353.524 243.81a12.192 12.192 0 0 1 0 20.072L86.162 509.849a12.207 12.207 0 0 1-6.922 2.154zM91.43 35.408v441.19l319.863-220.595L91.43 35.408z"
      style={{
        fill: '#262626'
      }}
      key="key-2"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'PlayIcon'
})
