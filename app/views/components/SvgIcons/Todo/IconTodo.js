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
    <defs key="key-0">
      <path id="s-4ec6f0a2b0-a" d="M0 0h24v24H0V0z" />
    </defs>,
    <clipPath id="s-4ec6f0a2b0-b" key="[object Object]">
      <use overflow="visible" xlinkHref="#s-4ec6f0a2b0-a" />
    </clipPath>,
    <path
      d="M14 10H2v2h12v-2zm0-4H2v2h12V6zM2 16h8v-2H2v2zm19.5-4.5L23 13l-6.99 7-4.51-4.5L13 14l3.01 3 5.49-5.5z"
      clipPath="url(#s-4ec6f0a2b0-b)"
      key="key-1"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconTodo'
})
