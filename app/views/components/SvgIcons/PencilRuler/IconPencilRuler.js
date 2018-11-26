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
      fill="none"
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.5"
      d="M5.25 23.25a3 3 0 0 1-3-3V7.458c0-.466.108-.925.317-1.341l2.012-4.025a.75.75 0 0 1 1.342 0l2.012 4.025c.209.416.317.875.317 1.341V20.25a3 3 0 0 1-3 3zM2.34 6.75h5.82M2.25 19.5h6m6 3.75a1.5 1.5 0 0 1-1.5-1.5V2.25a1.5 1.5 0 0 1 1.5-1.5h6a1.5 1.5 0 0 1 1.5 1.5v19.5a1.5 1.5 0 0 1-1.5 1.5zm-1.5-18h3m-3 4.5h3m-3 4.5h3m-3 4.5h3"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconPencilRuler'
})
