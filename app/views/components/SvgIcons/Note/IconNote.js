import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 512 512'

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
      d="M443.5 124.5c0-15-5.9-29.2-16.5-39.8-21.2-21.2-58.3-21.3-79.6 0l-59.2 59.2v-.6H68.5v300h300V222.8l58.5-58.5c10.6-10.7 16.5-24.8 16.5-39.8zm-43-13.3c3.5 3.5 5.5 8.2 5.5 13.2s-2 9.7-5.5 13.3l-4.2 4.2-26.5-26.5 4.2-4.2c7.1-7.1 19.4-7.1 26.5 0zM256 229.2l87.3-87.2 26.5 26.5-87.2 87.3H256v-26.6zm75 176.5H106v-225h145.5l-33 33v79.5H298l33-33v145.5z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconNote'
})
