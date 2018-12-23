import React from 'react'
import styled, { css } from 'styled-components'

const width = '13'
const height = '16'
const viewBox = '0 0 13 16'

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
    <g fill="#000" fillRule="evenodd" key="key-0">
      <path
        fillRule="nonzero"
        d="M12.81 3.805L9.29.195A.642.642 0 0 0 8.83 0H1.3C.582 0 0 .597 0 1.333v13.334C0 15.403.582 16 1.3 16h10.4c.718 0 1.3-.597 1.3-1.333V4.276a.675.675 0 0 0-.19-.471zM11.7 14.333a.33.33 0 0 1-.325.334h-9.75a.33.33 0 0 1-.325-.334V1.667a.33.33 0 0 1 .325-.334h6.802a.32.32 0 0 1 .23.098l2.948 3.024c.06.062.095.147.095.235v9.643z"
      />
      <path d="M5.339 4.39c.507.521.507 1.365 0 1.886-.508.52-1.331.52-1.839 0a1.358 1.358 0 0 1 0-1.885c.508-.521 1.33-.521 1.839 0M7.945 7.119a.32.32 0 0 0-.551 0L5.817 9.707a.16.16 0 0 1-.276 0l-.561-.922a.32.32 0 0 0-.552 0l-1.803 2.96a.17.17 0 0 0 .05.23.16.16 0 0 0 .088.025h7.865c.09 0 .162-.074.162-.166a.17.17 0 0 0-.025-.09L7.945 7.12z" />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'ImageFileIcon'
})
