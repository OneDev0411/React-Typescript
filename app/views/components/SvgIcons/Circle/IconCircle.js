import React from 'react'
import styled, { css } from 'styled-components'

const width = '512'
const height = '512'
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
      d="M256 0C114.509 0 0 114.497 0 256c0 141.491 114.497 256 256 256 141.491 0 256-114.497 256-256C512 114.509 397.503 0 256 0zm0 477.867c-122.337 0-221.867-99.529-221.867-221.867S133.663 34.133 256 34.133 477.867 133.663 477.867 256 378.337 477.867 256 477.867z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconCircle'
})
