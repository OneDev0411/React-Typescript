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
      fillRule="evenodd"
      d="M15.291 10.008A7.744 7.744 0 1 1 8.33 4.021a1.25 1.25 0 1 1-.176 2.494 5.251 5.251 0 1 0 4.702 4.053 1.25 1.25 0 1 1 2.436-.56zM8.198 13.48a7.744 7.744 0 1 1 6.962 5.987 1.25 1.25 0 0 1 .176-2.494 5.251 5.251 0 1 0-4.702-4.053 1.25 1.25 0 1 1-2.436.56z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconPartner'
})
