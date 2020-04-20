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
    <path
      key="icon-home-path-1"
      d="M20.897 10.6163l.82.6754c.2594.2135.5695.317.8773.317.4117 0 .8197-.185 1.0974-.5408.4847-.622.3874-1.531-.218-2.029L12.8775.3168a1.3752 1.3752 0 0 0-1.7563 0L.5262 9.039c-.6048.4983-.7029 1.407-.218 2.029.485.6221 1.3683.7226 1.9747.224l.8208-.6753v11.94c0 .797.6287 1.4434 1.4042 1.4434H19.492c.7758 0 1.405-.6464 1.405-1.4435V10.6163zM5.9127 21.1128V8.304l6.0872-5.011 6.0874 5.011v12.8088H5.9127z"
      fillRule="nonzero"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconHome'
})
