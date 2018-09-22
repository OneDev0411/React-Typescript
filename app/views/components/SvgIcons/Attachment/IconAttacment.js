import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 18 18'

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
      d="M4.181 18a1.122 1.122 0 0 1-.808-.343l-1.498-1.545A6.42 6.42 0 0 1 0 11.633a6.403 6.403 0 0 1 1.888-4.631l5.106-5.111A6.4 6.4 0 0 1 11.554 0c1.721 0 3.342.672 4.56 1.89A6.428 6.428 0 0 1 18 6.423a6.398 6.398 0 0 1-1.888 4.59l-3.669 3.674c-1.43 1.432-3.926 1.432-5.356 0a3.794 3.794 0 0 1 0-5.354l3.24-3.243c.44-.44 1.151-.44 1.59-.002.441.438.441 1.149.002 1.587l-3.24 3.242c-.6.603-.6 1.58 0 2.183.58.58 1.59.58 2.17 0l3.67-3.674a4.176 4.176 0 0 0 1.23-2.994 4.187 4.187 0 0 0-1.23-2.956c-1.588-1.588-4.349-1.587-5.934 0L3.48 8.587a4.175 4.175 0 0 0-1.23 3.021 4.185 4.185 0 0 0 1.23 2.929l1.509 1.558a1.122 1.122 0 0 1-.81 1.904l.002.001z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconAttacment'
})
