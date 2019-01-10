import React from 'react'
import styled, { css } from 'styled-components'

import { primary } from '../../../utils/colors'

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
  fill: ${({ color }) => color || primary};
`

const defaultProps = {
  children: [
    <circle cx="6" cy="50" r="6" key="key-0">
      <animate
        attributeName="opacity"
        begin=".1"
        dur="1s"
        repeatCount="indefinite"
        values="0;1;0"
      />
    </circle>,
    <circle cx="26" cy="50" r="6" key="key-1">
      <animate
        attributeName="opacity"
        begin=".2"
        dur="1s"
        repeatCount="indefinite"
        values="0;1;0"
      />
    </circle>,
    <circle cx="46" cy="50" r="6" key="key-2">
      <animate
        attributeName="opacity"
        begin=".3"
        dur="1s"
        repeatCount="indefinite"
        values="0;1;0"
      />
    </circle>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconBubblesSpinner'
})
