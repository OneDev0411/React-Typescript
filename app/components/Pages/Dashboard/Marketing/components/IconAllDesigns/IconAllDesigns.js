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
  ${({ noStyles }) => (!noStyles ? getDimensionsCss() : null)}
`

const defaultProps = {
  children: [
    <g fillRule="evenodd" key="key-0">
      <path d="M9.333 4.333A.667.667 0 0 0 10 3.667V1.333C10 .597 9.403 0 8.667 0H1.333C.597 0 0 .597 0 1.333v10.334C0 12.403.597 13 1.333 13h.334a.667.667 0 1 0 0-1.333.333.333 0 0 1-.334-.334V1.667c0-.184.15-.334.334-.334h6.666c.184 0 .334.15.334.334v2c0 .368.298.666.666.666z" />
      <path d="M3.333 2.833a.5.5 0 1 0-1 0v6a.5.5 0 1 0 1 0v-6z" />
      <circle cx="5" cy="3.333" r="1" />
      <circle cx="10.667" cy="8.333" r="1" />
      <path d="M14.667 5.333h-8c-.737 0-1.334.597-1.334 1.334v1.666a.667.667 0 0 0 1.334 0V7c0-.184.149-.333.333-.333h7.333c.184 0 .334.149.334.333v4c0 .184-.15.333-.334.333H13a.667.667 0 0 0 0 1.334h1.667c.736 0 1.333-.597 1.333-1.334V6.667c0-.737-.597-1.334-1.333-1.334z" />
      <path
        fillRule="nonzero"
        d="M3.333 11.333v3.334c0 .736.597 1.333 1.334 1.333H10c.736 0 1.333-.597 1.333-1.333v-3.334c0-.736-.597-1.333-1.333-1.333H4.667c-.737 0-1.334.597-1.334 1.333zm6.667 3c0 .184-.15.334-.333.334H5a.333.333 0 0 1-.333-.334v-1.282a.167.167 0 0 1 .228-.154l2.253.903c.12.047.252.047.37 0l2.253-.901a.167.167 0 0 1 .229.154v1.28zm-5-3h4.667c.184 0 .333.15.333.334 0 .037-.023.07-.057.084l-2.548 1.02a.173.173 0 0 1-.124 0l-2.547-1.02a.091.091 0 0 1-.057-.084c0-.184.149-.334.333-.334z"
      />
    </g>
  ],
  viewBox
}

export default Object.assign(Image, {
  getDimensions,
  getDimensionsCss,
  defaultProps,
  displayName: 'IconAllDesigns'
})
