import React from 'react'
import styled, { css } from 'styled-components'

const width = '32'
const height = '32'
const viewBox = '0 0 32 32'

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
      d="M24 6.3a1.95 1.95 0 0 0-1.95-1.95H12a.5.5 0 0 1-.447-.277l-.747-1.494A1.949 1.949 0 0 0 9.061 1.5H1.95A1.95 1.95 0 0 0 0 3.45v17.1a1.95 1.95 0 0 0 1.95 1.95h20.1A1.95 1.95 0 0 0 24 20.55V6.3zM22.048 20a.5.5 0 0 1-.5.5L2.5 20.549a.5.5 0 0 1-.5-.5L1.952 4a.5.5 0 0 1 .5-.5l6.256-.025a.5.5 0 0 1 .449.277l.761 1.523A1.941 1.941 0 0 0 11.66 6.35l9.84-.05a.5.5 0 0 1 .5.5l.048 13.2z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconFolder'
})
