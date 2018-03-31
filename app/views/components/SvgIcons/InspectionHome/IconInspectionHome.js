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
    <g fill="none" fillRule="evenodd" key="key-0">
      <path d="M0 0h24v24H0z" />
      <g fill="#000" fillRule="nonzero">
        <path d="M10.662 7.287L6.777 9.93l.324.504.784-.54v3.652h5.622V9.931l.75.504.323-.504-3.918-2.644zm-.222 4.591a.246.246 0 0 1-.238.243h-.511a.246.246 0 0 1-.238-.243v-.487c0-.121.102-.243.238-.243h.511c.12 0 .238.105.238.243v.487zm0-1.252a.246.246 0 0 1-.238.243h-.511a.246.246 0 0 1-.238-.243v-.487c0-.121.102-.243.238-.243h.511c.12 0 .238.105.238.243v.487zm1.363 1.252a.246.246 0 0 1-.238.243h-.511a.246.246 0 0 1-.238-.243v-.487c0-.121.102-.243.238-.243h.51c.12 0 .24.105.24.243v.487zm0-1.252a.246.246 0 0 1-.238.243h-.511a.246.246 0 0 1-.238-.243v-.487c0-.121.102-.243.238-.243h.51c.12 0 .24.105.24.243v.487z" />
        <path d="M15.63 14.487l4.037 4.038a.803.803 0 0 1-.002 1.14.81.81 0 0 1-1.14.002l-4.038-4.037a6.465 6.465 0 1 1 1.143-1.143zm-1.68-.536a4.848 4.848 0 1 0-6.855-6.857 4.848 4.848 0 0 0 6.856 6.857z" />
      </g>
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconInspectionHome'
})
