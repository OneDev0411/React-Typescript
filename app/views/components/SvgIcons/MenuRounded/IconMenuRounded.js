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
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
`

const defaultProps = {
  children: [
    <g fill="none" key="key-0">
      <path d="M24 0v24H0V0z" />
      <g fill="#9013FE" transform="rotate(90 8 12)">
        <path d="M8 0a8 8 0 1 0 0 16A8 8 0 0 0 8 0zm0 14.4A6.4 6.4 0 1 1 8 1.6a6.4 6.4 0 0 1 0 12.8z" />
        <circle cx="8" cy="11.812" r="1.288" />
        <circle cx="8" cy="8" r="1.288" />
        <circle cx="8" cy="4.188" r="1.288" />
      </g>
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconMenuRounded'
})
