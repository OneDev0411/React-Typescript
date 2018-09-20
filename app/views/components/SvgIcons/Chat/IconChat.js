import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 100 100'

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
      d="M15.25 81.63a4 4 0 0 0 5.52 4.24l16.38-7A50.32 50.32 0 0 0 50 80.56c22.75 0 41.25-15 41.25-33.38S72.74 13.81 50 13.81 8.75 28.78 8.75 47.19a29.54 29.54 0 0 0 8.48 20.31zm1.5-34.44c0-14 14.92-25.37 33.25-25.37S83.25 33.2 83.25 47.19 68.33 72.56 50 72.56a42.07 42.07 0 0 1-12-1.71 4 4 0 0 0-2.7.15l-11.15 4.74 1.28-9.11a4 4 0 0 0-1.22-3.47c-4.88-4.58-7.46-10.1-7.46-15.97z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconChat'
})
