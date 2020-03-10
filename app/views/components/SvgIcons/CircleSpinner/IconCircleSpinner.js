import React from 'react'
import styled, { css } from 'styled-components'

const width = '48'
const height = '48'
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
  fill: ${({ color, theme }) => color || theme.palette.primary.main};
`

const defaultProps = {
  children: [
    <path
      d="M73 50c0-12.7-10.3-23-23-23S27 37.3 27 50m3.9 0c0-10.5 8.5-19.1 19.1-19.1S69.1 39.5 69.1 50"
      key="key-0"
    >
      <animateTransform
        attributeName="transform"
        attributeType="XML"
        dur="1s"
        from="0 50 50"
        repeatCount="indefinite"
        to="360 50 50"
        type="rotate"
      />
    </path>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconCircleSpinner'
})
