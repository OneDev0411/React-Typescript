import React from 'react'
import styled, { css } from 'styled-components'

const width = '19'
const height = '19'
const viewBox = '0 0 19 19'

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
    <circle
      cx="2.5"
      cy="16.5"
      r="2.5"
      style={{
        fill: '#808080'
      }}
      key="key-0"
    />,
    <circle
      cx="2.5"
      cy="9.5"
      r="2.5"
      style={{
        fill: '#808080'
      }}
      key="key-1"
    />,
    <circle
      cx="2.5"
      cy="2.5"
      r="2.5"
      style={{
        fill: '#808080'
      }}
      key="key-2"
    />,
    <circle
      cx="9.5"
      cy="16.5"
      r="2.5"
      style={{
        fill: '#808080'
      }}
      key="key-3"
    />,
    <circle
      cx="9.5"
      cy="9.5"
      r="2.5"
      style={{
        fill: '#808080'
      }}
      key="key-4"
    />,
    <circle
      cx="9.5"
      cy="2.5"
      r="2.5"
      style={{
        fill: '#808080'
      }}
      key="key-5"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'DotMatrix'
})
