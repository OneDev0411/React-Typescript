import React from 'react'
import styled, { css } from 'styled-components'

const width = '16'
const height = '16'
const viewBox = '0 0 45.583 45.583'

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
      key="path-1"
      d="M22.793,12.196c-3.361,0-6.078-2.729-6.078-6.099C16.715,2.73,19.432,0,22.793,0c3.353,0,6.073,2.729,6.073,6.097
          C28.866,9.466,26.145,12.196,22.793,12.196z"
    />,
    <path
      key="path-2"
      d="M22.794,28.889c-3.361,0-6.079-2.729-6.079-6.099c0-3.366,2.717-6.099,6.078-6.099c3.353,0,6.073,2.732,6.075,6.099
          C28.866,26.162,26.144,28.889,22.794,28.889z"
    />,
    <path
      key="path-3"
      d="M22.794,45.583c-3.361,0-6.079-2.729-6.079-6.099s2.717-6.098,6.078-6.098c3.353-0.002,6.073,2.729,6.073,6.098
          S26.144,45.583,22.794,45.583z"
    />
  ],

  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'VerticalDotsIcon'
})
