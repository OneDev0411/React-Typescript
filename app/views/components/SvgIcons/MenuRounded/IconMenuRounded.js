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
    <path
      d="M20 12a8 8 0 1 0-8 8 8 8 0 0 0 8-8zM5.6 12a6.4 6.4 0 1 1 6.4 6.4A6.4 6.4 0 0 1 5.6 12zm1.3 0a1.288 1.288 0 1 0 2.576 0A1.288 1.288 0 0 0 6.9 12zm3.812 0a1.288 1.288 0 1 0 2.576 0 1.288 1.288 0 0 0-2.576 0zm3.812 0a1.288 1.288 0 1 0 2.576 0 1.288 1.288 0 0 0-2.576 0z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconMenuRounded'
})
