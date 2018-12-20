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
      d="M13.5 19.5v2.25c0 .414.336.75.75.75h6a.75.75 0 0 0 .75-.75V2.25a.75.75 0 0 0-.75-.75h-6a.75.75 0 0 0-.75.75V4.5h2.25a.75.75 0 1 1 0 1.5H13.5v3h2.25a.75.75 0 1 1 0 1.5H13.5v3h2.25a.75.75 0 1 1 0 1.5H13.5v3h2.25a.75.75 0 1 1 0 1.5H13.5zm-6-.75V7.5H3v11.25h4.5zm0 1.5H3a2.25 2.25 0 0 0 4.5 0zm1.5-.752a.765.765 0 0 1 0 .004v.748a3.75 3.75 0 0 1-7.5 0V7.459c0-.583.135-1.158.396-1.677l2.012-4.025a1.5 1.5 0 0 1 2.684 0L8.603 5.78C8.865 6.3 9 6.876 9 7.458v12.04zM7.036 6L5.25 2.427 3.464 6h3.572zm7.214 18A2.25 2.25 0 0 1 12 21.75V2.25A2.25 2.25 0 0 1 14.25 0h6a2.25 2.25 0 0 1 2.25 2.25v19.5A2.25 2.25 0 0 1 20.25 24h-6z"
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