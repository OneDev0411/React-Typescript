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
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)}
`

const defaultProps = {
  children: [
    <path
      d="M22.5 10.5H14V6.8a1 1 0 0 0-1.625-.78l-6.5 5.2a1 1 0 0 0 0 1.561l6.5 5.2a1.022 1.022 0 0 0 1.058.121A1 1 0 0 0 14 17.2v-3.7h8.5a1.5 1.5 0 0 0 0-3z"
      key="key-0"
    />,
    <path
      d="M22.45 15.587a1 1 0 0 0-1.322.5 10 10 0 1 1-.02-8.223 1 1 0 1 0 1.82-.829 12 12 0 1 0 .026 9.871 1 1 0 0 0-.504-1.319z"
      key="key-1"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'LoginIcon'
})
