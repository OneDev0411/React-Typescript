import React from 'react'
import styled, { css } from 'styled-components'

const width = '12'
const height = '12'
const viewBox = '0 0 8 8'

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
      fill="#fff"
      d="M7.92 6.928L4.625.392A.702.702 0 0 0 4 0a.702.702 0 0 0-.624.392L.08 6.928a.757.757 0 0 0 .022.719A.7.7 0 0 0 .705 8h6.59a.7.7 0 0 0 .603-.353.757.757 0 0 0 .022-.72zM3.647 2.689A.36.36 0 0 1 4 2.323a.36.36 0 0 1 .353.366v2.197A.36.36 0 0 1 4 5.252a.36.36 0 0 1-.353-.366V2.689zm.37 4.214h-.01a.548.548 0 0 1-.536-.538.552.552 0 0 1 .142-.391.512.512 0 0 1 .369-.169h.01c.288 0 .525.237.537.537a.552.552 0 0 1-.142.393.511.511 0 0 1-.37.168z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconDeclined'
})
