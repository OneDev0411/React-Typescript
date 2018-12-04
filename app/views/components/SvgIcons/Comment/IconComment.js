import React from 'react'
import styled, { css } from 'styled-components'

const width = '21'
const height = '18'
const viewBox = '0 0 21 18'

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
      fill="#17181a"
      fillRule="evenodd"
      d="M3.293 16H11c4.411 0 8-3.14 8-7s-3.589-7-8-7-8 3.14-8 7c0 1.537.568 3 1.642 4.232a1 1 0 0 1-.021 1.338L3.293 16zM11 18H1a1 1 0 0 1-.733-1.68l2.306-2.484C1.541 12.392 1 10.735 1 9c0-4.962 4.486-9 10-9s10 4.038 10 9-4.486 9-10 9z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IcomComment'
})
