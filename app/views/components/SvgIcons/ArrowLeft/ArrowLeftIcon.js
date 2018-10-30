import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '12'
const viewBox = '0 0 24 12'

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
      fill="#FFF"
      fillRule="evenodd"
      d="M22.5 4.5H7.027a.25.25 0 0 1-.25-.25V1.222A1 1 0 0 0 5.07.515L.292 5.293a1 1 0 0 0 0 1.414l4.778 4.778a1 1 0 0 0 1.707-.707V7.75a.25.25 0 0 1 .25-.25H22.5a1.5 1.5 0 0 0 0-3z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'ArrowLeftIcon'
})
