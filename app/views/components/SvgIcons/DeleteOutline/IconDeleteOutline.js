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
      d="M10.138 0c-.579 0-1.159.2-1.593.599-.435.399-.609.996-.609 1.566v1.083L2 3.246V5.41h1.477v15.236c0 1.794 1.505 3.274 3.33 3.274h11.061c1.825 0 3.33-1.48 3.33-3.274V5.439h1.477V3.275h-5.906V2.192A2.27 2.27 0 0 0 16.16.626C15.754.198 15.118 0 14.538 0h-4.4zm0 2.164h4.43v1.082h-4.43V2.164zM5.707 5.439h13.262v15.235a1.09 1.09 0 0 1-1.1 1.083l-11.061-.002a1.09 1.09 0 0 1-1.101-1.082V5.439z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconDeleteOutline'
})
