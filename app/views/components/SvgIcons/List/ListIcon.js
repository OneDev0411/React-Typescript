import React from 'react'
import styled, { css } from 'styled-components'

const width = '24'
const height = '24'
const viewBox = '0 0 24 24'

const getDimensionsCss = () => css`
  width: ${width}px;
  height: ${height}px;
`

const Image = styled.svg`
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)};
`

function ListIcon(props) {
  const { color = '#fff' } = props

  return (
    <Image viewBox={viewBox}>
      <g fill={color} fillRule="evenodd" transform="translate(4 5)" key="key-0">
        <ellipse cx="1.667" cy="1.908" rx="1.667" ry="1.591" />
        <path d="M5.667 2.545h9.666c.369 0 .667-.284.667-.636 0-.351-.298-.636-.667-.636H5.667c-.369 0-.667.285-.667.636 0 .352.298.636.667.636z" />
        <ellipse cx="1.667" cy="6.999" rx="1.667" ry="1.591" />
        <path d="M15.333 6.364H5.667C5.298 6.364 5 6.649 5 7c0 .351.298.636.667.636h9.666c.369 0 .667-.285.667-.636 0-.351-.298-.636-.667-.636z" />
        <ellipse cx="1.667" cy="12.09" rx="1.667" ry="1.591" />
        <path d="M15.333 11.455H5.667c-.369 0-.667.284-.667.636 0 .351.298.636.667.636h9.666c.369 0 .667-.285.667-.636 0-.352-.298-.636-.667-.636z" />
      </g>
    </Image>
  )
}

export default ListIcon
