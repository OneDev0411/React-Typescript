import React from 'react'
import styled, { css } from 'styled-components'

const width = '20'
const height = '20'
const viewBox = '0 0 20 20'

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
      fill="#000"
      key="key-0"
      d="M5.627.147l-5.5 6a.51.51 0 0 0 0 .71.51.51 0 0 0 .71 0l4.63-5.05v13.68a4.51 4.51 0 0 0 4.52 4.5h9.5a.5.5 0 0 0 0-1h-9.5a3.5 3.5 0 0 1-3.5-3.5V1.777l4.63 5.05a.502.502 0 1 0 .74-.68l-5.5-6a.38.38 0 0 0-.13-.09.52.52 0 0 0-.4 0 .38.38 0 0 0-.2.09z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'ArrowLeftTopIcon'
})
