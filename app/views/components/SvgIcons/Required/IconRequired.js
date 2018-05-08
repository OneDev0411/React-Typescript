import React from 'react'
import styled, { css } from 'styled-components'

const width = '98'
const height = '27'
const viewBox = '0 0 98 27'

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
    <g fill="none" fillRule="evenodd" key="key-0">
      <path
        fill="#FE3824"
        d="M0 13L15.173.672A3 3 0 0 1 17.065 0H95a3 3 0 0 1 3 3v21a3 3 0 0 1-3 3H17.127a3 3 0 0 1-1.975-.742L0 13z"
      />
      <text
        fill="#FFF"
        fontFamily="San Francisco, Helvetica, Arial, sans-serif"
        fontSize="14"
      >
        <tspan x="25.773" y="18">
          Required
        </tspan>
      </text>
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'Required'
})
