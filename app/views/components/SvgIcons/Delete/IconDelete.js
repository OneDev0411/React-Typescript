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
  ${({noStyles}) => !noStyles ? getDimensionsCss() : null}
`

const defaultProps = {
  children: [
    <path
      d='M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z'
      key='key-0'
    />,
    <path
      fill='none'
      d='M0 0h24v24H0z'
      key='key-1'
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconDelete'
})
