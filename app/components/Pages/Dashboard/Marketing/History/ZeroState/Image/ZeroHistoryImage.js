import React from 'react'
import styled, { css } from 'styled-components'

const width = '69'
const height = '88'
const viewBox = '0 0 69 88'

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
    <g fill="none" fillRule="evenodd" key="key-0">
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round" 
        strokeWidth="3"
        d="M3.5 2h62A1.5 1.5 0 0 1 67 3.5V67H2V3.5A1.5 1.5 0 0 1 3.5 2zM2 67h65v17.5a1.5 1.5 0 0 1-1.5 1.5h-62A1.5 1.5 0 0 1 2 84.5V67z"
      />
      <path
        fill="#CC5266"
        fillRule="nonzero"
        d="M21.462 51h27.076A2.462 2.462 0 0 0 51 48.538V21.462A2.462 2.462 0 0 0 48.538 19H21.462A2.462 2.462 0 0 0 19 21.462v27.076A2.462 2.462 0 0 0 21.462 51zm2.05-8.229l3.9-7.589a1.844 1.844 0 0 1 2.864-.539l3 2.661a.62.62 0 0 0 .951-.17l4.27-7.93a1.846 1.846 0 0 1 3.385.312l4.308 13.538a1.846 1.846 0 0 1-1.76 2.408H25.154a1.846 1.846 0 0 1-1.642-2.69z"
      />
      <path
        stroke="#000"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="3"
        d="M13.125 74.313H53.5m-40.375 6H26.25"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'ZeroHistoryImage'
})
