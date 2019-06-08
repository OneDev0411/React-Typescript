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
      fillRule="evenodd"
      fill="#d1d1d1"
      d="M5.924 18.69h.835c.304 0 .551.247.551.552v1.931a.828.828 0 0 0 1.366.628l3.475-2.98a.552.552 0 0 1 .36-.132h5.558A1.933 1.933 0 0 0 20 16.76V7.93A1.933 1.933 0 0 0 18.069 6H5.931A1.933 1.933 0 0 0 4 7.931v8.827a1.952 1.952 0 0 0 1.924 1.932z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconComment'
})
