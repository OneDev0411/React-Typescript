import React from 'react'
import styled, { css } from 'styled-components'

const width = '48'
const height = '48'
const viewBox = '0 0 100 100'

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
      d="M59.487 68c-.26 5.014-4.408 9-9.487 9s-9.227-3.986-9.487-9H30.01a6.504 6.504 0 0 1-6.51-6.5 6.505 6.505 0 0 1 6-6.48V43.5C29.5 32.174 38.677 23 50 23s20.5 9.177 20.5 20.5v11.52c3.35.256 6 3.061 6 6.48 0 3.588-2.917 6.5-6.51 6.5H59.487zm-5.014 0h-8.946a4.5 4.5 0 0 0 8.946 0zm15.525-8a4.495 4.495 0 0 1-4.498-4.502V43.5C65.5 34.94 58.562 28 50 28c-8.562 0-15.5 6.937-15.5 15.5v11.998A4.502 4.502 0 0 1 30.002 60c-.828 0-1.502.674-1.502 1.5 0 .828.674 1.5 1.51 1.5h39.98c.833 0 1.51-.675 1.51-1.5 0-.824-.677-1.5-1.502-1.5z"
      fillRule="nonzero"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconNotifications'
})
