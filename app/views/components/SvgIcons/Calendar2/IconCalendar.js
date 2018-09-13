import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 48 48'

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
      d="M43.999 18L44 10.008l-6-.003v1.99A1.998 1.998 0 0 1 36 14c-1.105 0-2-.897-2-2.006v-1.99C27.891 10.002 20.107 10 14 10v1.993A1.998 1.998 0 0 1 12 14c-1.105 0-2-.897-2-2.006V10H4.01c-.002 0-.004 3.376-.005 8h39.994zm0 4H4.003C4 31.784 4 43.992 4 43.992c0 .006 39.99.008 39.99.008.004 0 .007-12.215.008-22zM38 6h5.99A4.007 4.007 0 0 1 48 10.008v33.984A4.008 4.008 0 0 1 43.99 48H4.01A4.007 4.007 0 0 1 0 43.992V10.008A4.008 4.008 0 0 1 4.01 6H10V2.006C10 .898 10.888 0 12 0c1.105 0 2 .897 2 2.006V6h20V2.006C34 .898 34.888 0 36 0c1.105 0 2 .897 2 2.006V6z"
      fillRule="evenodd"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconCalendar'
})
