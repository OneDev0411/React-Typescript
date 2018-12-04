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
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
`

const defaultProps = {
  children: [
    <path
      fill="gray"
      d="M12.5 5.333h-.75V3.81C11.75 1.708 10.07 0 8 0 5.93 0 4.25 1.707 4.25 3.81v1.523H3.5c-.825 0-1.5.686-1.5 1.524v7.62C2 15.313 2.675 16 3.5 16h9c.825 0 1.5-.686 1.5-1.524V6.857c0-.838-.675-1.524-1.5-1.524zM5.75 3.81c0-1.264 1.005-2.285 2.25-2.285s2.25 1.02 2.25 2.285v1.524h-4.5V3.81zm6.75 10.667h-9V6.857h9v7.62zM8 12.19c.825 0 1.5-.685 1.5-1.523 0-.838-.675-1.524-1.5-1.524s-1.5.686-1.5 1.524.675 1.524 1.5 1.524z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'Lock'
})
