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
    <path fill="none" d="M0 0h24v24H0z" key="key-0" />,
    <path
      d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z"
      key="key-1"
    />,
    <path fill="none" d="M0 0h24v24H0z" key="key-2" />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'StarIcon'
})
