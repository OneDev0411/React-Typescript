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
      <path
        fill="#000"
        fillRule="nonzero"
        d="M16 4H8c-1.105 0-2 .796-2 1.778v12.444C6 19.204 6.895 20 8 20h8c1.105 0 2-.796 2-1.778V5.778C18 4.796 17.105 4 16 4zm1 14.222c0 .49-.448.889-1 .89H8c-.552-.001-1-.4-1-.89V5.778c0-.49.448-.889 1-.89h1c0 .492.448.89 1 .89h4c.552 0 1-.398 1-.89h1c.552.001 1 .4 1 .89v12.444zm-4-.889c0 .491-.448.89-1 .89s-1-.399-1-.89c0-.49.448-.889 1-.889.265 0 .52.094.707.26a.842.842 0 0 1 .293.63z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconText'
})
