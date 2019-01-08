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
      fill="#003bdf"
      d="M16.105 7.946L15.135 7l-4.363 4.255.97.946 4.363-4.255zM19.023 7l-7.281 7.1-2.877-2.798-.97.946L11.742 16 20 7.946 19.023 7zM4 12.248L7.847 16l.97-.946-3.84-3.752-.977.946z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'DoubleCheck'
})
