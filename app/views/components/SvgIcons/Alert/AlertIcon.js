import React from 'react'
import styled, { css } from 'styled-components'

const width = '16'
const height = '16'
const viewBox = '0 0 16 16'

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
    <g fill="none" fillRule="nonzero" key="key-0">
      <path
        fill="#FFF"
        d="M8 .174C3.588.174 0 3.684 0 8s3.588 7.826 8 7.826 8-3.51 8-7.826S12.412.174 8 .174zm0 1.043c3.835 0 6.933 3.03 6.933 6.783 0 3.752-3.098 6.783-6.933 6.783S1.067 11.753 1.067 8c0-3.752 3.098-6.783 6.933-6.783zm0 1.044c-.59 0-1.067.467-1.067 1.043l.178 6.783c0 .48.398.87.889.87a.88.88 0 0 0 .889-.87l.178-6.783c0-.576-.478-1.043-1.067-1.043zm0 9.391c-.59 0-1.067.467-1.067 1.044 0 .576.478 1.043 1.067 1.043.59 0 1.067-.467 1.067-1.043 0-.577-.478-1.044-1.067-1.044z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'Alert'
})
