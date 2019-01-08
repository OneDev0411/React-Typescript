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
      key="key-0"
      fillRule="nonzero"
      d="M3.974 12.728a6.348 6.348 0 1 1 11.403-1.396l5.296 5.296c.21.21.328.494.327.79V20a1.002 1.002 0 0 1-1 1h-2.58c-.295 0-.578-.115-.787-.323l-.652-.651a1.185 1.185 0 0 1-.338-.827v-.782h-.632a1.32 1.32 0 0 1-1.32-1.319v-.632h-.779a1.13 1.13 0 0 1-.84-.346l-.74-.741a6.347 6.347 0 0 1-7.358-2.65zm1.364-.678a4.832 4.832 0 0 0 5.89 1.752.757.757 0 0 1 .831.161l.988.988h1.24a.92.92 0 0 1 .92.919v1.02h1.023c.507 0 .918.41.918.918v1.243l.434.434h1.901v-1.901l-5.52-5.524a.758.758 0 0 1-.162-.83 4.833 4.833 0 0 0-7.866-5.304 4.838 4.838 0 0 0-.597 6.124zm2.808-1.646a2.256 2.256 0 1 1 0-4.511 2.256 2.256 0 0 1 0 4.511zm-.524-2.766a.741.741 0 1 0 .524-.215h-.053a.74.74 0 0 0-.471.215z"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconClosing'
})
