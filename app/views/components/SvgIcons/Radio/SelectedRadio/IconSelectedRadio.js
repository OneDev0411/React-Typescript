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
    <circle
      key="IconSelectedRadio-circle-1"
      cx="12"
      cy="12"
      r="8"
      fill="#00B286"
    />,
    <circle
      key="IconSelectedRadio-circle-2"
      cx="12"
      cy="12"
      r="3"
      fill="#FFF"
      fillRule="nonzero"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconSelectedRadio'
})
