import React from 'react'
import styled, { css } from 'styled-components'

const width = '11'
const height = '8'
const viewBox = '0 0 11 8'
const color = '#fff'

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
    <path fill="none" stroke={color} d="M9.571 1L3.143 7 1 4.857" key="key-0" />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'Checkmark'
})
