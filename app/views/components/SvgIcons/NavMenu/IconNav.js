import React from 'react'
import styled, { css } from 'styled-components'

const width = '16'
const height = '13'
const viewBox = '0 0 16 13'

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
      <path d="M-4-6h24v24H-4z" />
      <path
        fill="#263445"
        fillRule="nonzero"
        d="M12.667 5.27H0v2.811h12.667zM16 0H0v2.811h16zm0 10.189H0V13h16z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'NavIcon'
})
