import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '12'
const viewBox = '0 0 24 12'

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
      fill="#FFF"
      fillRule="evenodd"
      d="M23.707 5.07L18.929.294A1 1 0 0 0 17.222 1v3.028a.25.25 0 0 1-.25.25H1.5a1.5 1.5 0 0 0 0 3h15.472a.25.25 0 0 1 .25.25v3.028a1 1 0 0 0 1.707.707l4.778-4.778a1 1 0 0 0 0-1.414z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'ArrowRightIcon'
})
