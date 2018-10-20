import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 100 100'

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
      d="M90 2H26a16 16 0 0 0-16 16v4H6a4 4 0 0 0 0 8h4v16H6a4 4 0 0 0 0 8h4v16H6a4 4 0 0 0 0 8h4v4a16 16 0 0 0 16 16h64a8 8 0 0 0 8-8V10a8 8 0 0 0-8-8zm0 88H26a8 8 0 0 1-8-8v-4h4a4 4 0 0 0 0-8h-4V54h4a4 4 0 0 0 0-8h-4V30h4a4 4 0 0 0 0-8h-4v-4a8 8 0 0 1 8-8h64z"
      key="key-0"
    />,
    <path
      d="M38 78a4 4 0 0 0 4-4v-4a16 16 0 0 1 32 0v4a4 4 0 0 0 8 0v-4a24 24 0 0 0-12.43-21 16 16 0 1 0-23.14 0A24 24 0 0 0 34 70v4a4 4 0 0 0 4 4zm12-40a8 8 0 1 1 8 8 8 8 0 0 1-8-8z"
      key="key-1"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconContacts'
})
