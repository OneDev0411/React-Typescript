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
      fillRule="evenodd"
      d="M2.687 7a.898.898 0 0 1-.628-.244L.283 5.032a.846.846 0 0 1-.255-.844.876.876 0 0 1 .64-.622.906.906 0 0 1 .87.247l1.15 1.114 3.818-3.696a.908.908 0 0 1 1.234.022.844.844 0 0 1 .022 1.197L3.32 6.76a.905.905 0 0 1-.633.24z"
      key="key-0"
    />
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconApproved'
})
