import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 16 16'

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
    <g fill="none" fillRule="evenodd" key="key-0">
      <path d="M0 0h16v16H0z" />
      <path
        fill="#7F7F7F"
        d="M0 .99C0 .445.451 0 .99 0h4.02c.546 0 .99.451.99.99v4.02c0 .546-.451.99-.99.99H.99A.996.996 0 0 1 0 5.01V.99zM2 2v2h2V2H2zm8-1.01c0-.546.451-.99.99-.99h4.02c.546 0 .99.451.99.99v4.02c0 .546-.451.99-.99.99h-4.02a.996.996 0 0 1-.99-.99V.99zM12 2v2h2V2h-2zm-2 8.99c0-.546.451-.99.99-.99h4.02c.546 0 .99.451.99.99v4.02c0 .546-.451.99-.99.99h-4.02a.996.996 0 0 1-.99-.99v-4.02zM12 12v2h2v-2h-2zM0 10.99c0-.546.451-.99.99-.99h4.02c.546 0 .99.451.99.99v4.02c0 .546-.451.99-.99.99H.99a.996.996 0 0 1-.99-.99v-4.02zM2 12v2h2v-2H2z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconGalleryView'
})
