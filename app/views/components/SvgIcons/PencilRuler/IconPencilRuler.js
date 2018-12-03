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
      d="M6 19.25a.25.25 0 0 1-.25-.25V7.25A.25.25 0 0 1 6 7h1a.25.25 0 0 1 .25.25V19a.25.25 0 0 1-.25.25zm2.5 0a.25.25 0 0 1-.25-.25V7.25A.25.25 0 0 1 8.5 7h1a.25.25 0 0 1 .25.25V19a.25.25 0 0 1-.25.25zm-5 0a.25.25 0 0 1-.25-.25V7.25A.25.25 0 0 1 3.5 7h1a.25.25 0 0 1 .25.25V19a.25.25 0 0 1-.25.25zM9.3 6a.25.25 0 0 0 .226-.358L6.951.283a.522.522 0 0 0-.9 0L3.478 5.642A.25.25 0 0 0 3.7 6zM3.5 20.25a.25.25 0 0 0-.25.25v.25a3.25 3.25 0 0 0 6.5 0v-.25a.25.25 0 0 0-.25-.25zM19.25 0h-5a1.5 1.5 0 0 0-1.5 1.5v1.25c0 .138.112.25.25.25h1.75a.5.5 0 0 1 0 1H13a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h1.75a.5.5 0 0 1 0 1H13a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h1.75a.5.5 0 0 1 0 1H13a.25.25 0 0 0-.25.25v2.5c0 .138.112.25.25.25h1.75a.5.5 0 0 1 0 1H13a.25.25 0 0 0-.25.25v6.25a1.5 1.5 0 0 0 1.5 1.5h5a1.5 1.5 0 0 0 1.5-1.5v-21a1.5 1.5 0 0 0-1.5-1.5zm-2.5 19.5a1.25 1.25 0 1 1-1.25 1.25c.001-.69.56-1.249 1.25-1.25z"
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
