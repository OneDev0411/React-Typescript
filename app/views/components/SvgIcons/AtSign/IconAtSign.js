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
      d="M14.968 19.181c-1.33.614-2.482.819-4.055.819C7.235 20 4 17.294 4 12.838 4 8.2 7.301 4.176 12.287 4.176c3.921 0 6.713 2.75 6.713 6.57 0 3.343-1.817 5.434-4.21 5.434-1.041 0-1.794-.568-1.905-1.75h-.044c-.71 1.136-1.684 1.75-2.88 1.75-1.419 0-2.482-1.114-2.482-2.978 0-2.797 2.016-5.298 5.206-5.298.975 0 2.083.25 2.615.546l-.665 4.23c-.2 1.34-.044 1.954.576 1.977.953.046 2.15-1.205 2.15-3.842 0-2.979-1.862-5.252-5.296-5.252-3.412 0-6.359 2.705-6.359 7.07 0 3.82 2.349 5.957 5.65 5.957 1.13 0 2.349-.25 3.235-.705l.377 1.296zm-1.95-9.39a2.808 2.808 0 0 0-.687-.09c-1.462 0-2.615 1.477-2.615 3.228 0 .864.377 1.41 1.086 1.41.842 0 1.706-1.069 1.883-2.388l.333-2.16z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconAtSign'
})
